var Queue = require('bull');
var spotifyApi = require('../spotifyApi');
var db = require('../db');

const updateDb = new Queue('cache-db');

updateDb.process(async (job) => {
    console.log('Job Started');
    const res = await spotifyApi.getMe();
    const user = res.body;
    
    db.query('INSERT INTO public.user(uri) VALUES($1)', user.uri);
    
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
                
                let insertTracksStatement = insertTracksStatement.slice(0, -1);
                console.log(insertTracksArray);
                if (insertTracksArray.length > 0) {
                    db.query(insertTracksStatement, insertTracksArray);
                }
                trackOffset += trackLimit;
            } while (trackTotal === null || trackOffset < trackTotal);
        }

        offset += limit;
    } while (total === null || offset < total);
    console.log('Job Finished');
})


module.exports = updateDb;