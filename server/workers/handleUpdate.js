var Queue = require('bull');
var spotifyApi = require('../spotifyApi');
var db = require('../db');

const handleUpdateQueue = new Queue('handle-update');
const insertDb = new Queue('insert-db');
const modifyDb = new Queue('modify-db');

insertDb.process(async (job) => {
    console.log(`Insert Db Started:`);
    //console.log(job);
    const { user } = job.data;
    try {
        await db.query('INSERT INTO public.user(uri, last_updated) VALUES($1, $2) ON CONFLICT (uri) DO UPDATE SET last_updated=$3', [user.uri, new Date(), new Date()]);
        
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
                
                const statement = 'INSERT INTO public.user_saved_playlist(user_uri, playlist_uri) VALUES($1, $2) ON CONFLICT (user_uri, playlist_uri) DO NOTHING';
                db.query(statement, [user.uri, playlist.uri]);

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

                insertTracksStatement = insertTracksStatement.slice(0, -1) + ' ON CONFLICT (playlist_uri, track_uri) DO NOTHING';
                if (insertTracksArray.length > 0) {
                    db.query(insertTracksStatement, insertTracksArray);
                }
            }

            offset += limit;
        } while (total === null || offset < total);

        console.log('Insert Db Ended');
    } catch (err) {
        console.error(err);
        // Delete user since data was unable to be stored correctly.
        db.query('DELETE FROM public.user WHERE uri=$1', [user.uri]);
    }
});

modifyDb.process(async (job) => {
    console.log(`Modify Db Started:`);
    //console.log(job);
    const { user } = job.data;
    try {
        await db.query('UPDATE public.user SET last_updated=$1 WHERE uri=$2', [new Date(), user.uri]);

        // Flush out track_in_playlist
        const statement = `DELETE FROM public.track_in_playlist
                            USING public.user_saved_playlist
                            WHERE public.track_in_playlist.playlist_uri = public.user_saved_playlist.playlist_uri
                            AND public.user_saved_playlist.user_uri = $1`;
        await db.query(statement, [user.uri]);

        // Flush out user_saved_playlist
        await db.query('DELETE FROM public.user_saved_playlist WHERE user_uri=$1', [user.uri]);

        console.log('Modify Db ended');
        insertDb.add({ user: user });
    } catch (err) {
        console.error(err);
    }
});

handleUpdateQueue.process(async (job) => {
    console.log(`Handle Update Started:`);
    //console.log(job);
    const res = await spotifyApi.getMe();
    const user = res.body;
    
    const data = await db.query('SELECT * FROM public.user WHERE uri=$1', [user.uri]);
    

    const staleDataTime = parseInt(process.env.STALE_DATA_TIMEOUT);
    try {
        if (data.rowCount === 0) {
            // User not in database
            console.log(`${user.display_name}: User not in Db`)
            insertDb.add({ user: user });

        } else if (new Date() - data.rows[0].last_updated > staleDataTime) {
            // User in database and stale data
            console.log(`${user.display_name}: In Db and Stale Data`)
            modifyDb.add({ user: user });

        } else {
            // User in database and not stale data
            console.log(`${user.display_name}: In Db and Valid Data`)
        }
    } catch (err) {
        console.error(err);
    }
})

module.exports = handleUpdateQueue;