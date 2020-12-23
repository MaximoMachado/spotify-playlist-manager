var Queue = require('bull');
var spotifyApi = require('../spotifyApi');
var db = require('../db');

const insertDb = new Queue('insert-db');
const modifyDb = new Queue('modify-db');

insertDb.process(async (job) => {
    // TODO Add params on what user/playlist/track to update and neccessary things to do in 

    const { user, isModifying } = job;

    if (!isModifying) {
        await db.query('INSERT INTO public.user(uri, last_updated) VALUES($1, $2)', [user.uri, new Date()]);
    }
    
    let limit = 50;
    let offset = 0;
    let total = null;
    do {
        const playlistsData = await spotifyApi.getUserPlaylists({limit: limit, offset: offset});
        if (total === null) {
            total = playlistsData.body.total;
        }

        let playlists = playlistsData.body.items;
        for (let i = 0; i < playlists.length; i++) {
            let playlist = playlists[i];
            
            db.query('INSERT INTO public.user_saved_playlist(user_uri, playlist_uri) VALUES($1, $2)', [user.uri, playlist.uri]);

            let trackLimit = 100;
            let trackOffset = 0;
            let trackTotal = null;

            let insertTracksStatement = 'INSERT INTO public.track_in_playlist(playlist_uri, track_uri) VALUES';
            let insertTracksArray = [];
            do {
                

                let tracksData = await spotifyApi.getPlaylistTracks(playlist.id, { limit: trackLimit, offset: trackOffset });
                let tracks = tracksData.body.items;

                if (trackTotal === null) {
                    trackTotal = tracksData.body.total;
                }

                for (let j = 0; j < tracks.length; j++) {
                    let track = tracks[j].track;

                    const firstIndex = 2 * (j + trackOffset) + 1;
                    const secondIndex = 2 * (j + trackOffset) + 2;
                    insertTracksStatement += ` ($${firstIndex}, $${secondIndex}),`;

                    insertTracksArray.push(playlist.uri);
                    insertTracksArray.push(track.uri);
                }
                
                trackOffset += trackLimit;
            } while (trackTotal === null || trackOffset < trackTotal);

            insertTracksStatement = insertTracksStatement.slice(0, -1);
            if (insertTracksArray.length > 0) {
                db.query(insertTracksStatement, insertTracksArray);
            }
        }

        offset += limit;
    } while (total === null || offset < total);
});

modifyDb.process(async (job) => {
    const { user } = job;

    await db.query('UPDATE public.user SET last_update=$1 WHERE uri=$2', [new Date(), user.uri]);

    // Flush out track_in_playlist
    const statement = 'DELETE FROM public.track_in_playlist \
                        USING public.user_saved_playlist \
                        WHERE public.track_in_playlist.playlist_uri = public.user_saved_playlist.playlist_uri \
                        AND public.user_saved_playlist.user_uri = $1';
    await db.query(statement, [user.uri]);

    // Flush out user_saved_playlist
    await db.query('DELETE FROM public.user_saved_playlist WHERE user_uri=$1', [user.uri]);

    insertDb.add({ user: user, isModifying: true });
});

module.exports = { insertDb, modifyDb };