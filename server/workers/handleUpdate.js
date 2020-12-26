var Queue = require('bull');
var spotifyApi = require('../spotifyApi');
var db = require('../db');

const handleUpdateQueue = new Queue('handle-update');
const insertDb = new Queue('insert-db');
const modifyDb = new Queue('modify-db');

insertDb.process(async (job) => {
    /**
     * Gets the user's tracks within each playlist and stores them in the respective database tables
     * Allows for efficient checks of whether song is contained within a playlist and set operations
     * 
     * Params (within job object):
     * user {object}: User to update within database
     */
    console.log(`Insert Db Started:`);
    //console.log(job);
    const { user } = job.data;
    try {
        await db.query('INSERT INTO public.user(uri, last_updated) VALUES($1, $2) ON CONFLICT (uri) DO UPDATE SET last_updated=$3', [user.uri, new Date(), new Date()]);
        
        let limit = 50;
        let offset = 0;
        let total = null;
        // Iterate over playlist paging object to get all pages
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
                // Iterate over track paging object to get all pages
                do {
                    let tracksData = await spotifyApi.getPlaylistTracks(playlist.id, { limit: trackLimit, offset: trackOffset });
                    let tracks = tracksData.body.items;

                    if (trackTotal === null) {
                        trackTotal = tracksData.body.total;
                    }

                    let index = 1;
                    for (let j = 0; j < tracks.length; j++) {
                        let track = tracks[j].track;

                        if (track === null) {
                            // Fuck you Spotify, you wasted 3 hours of our lives
                            // and you even still have the uri of the deleted song, come on man. Just return it anyways
                            // Track from playlist tracks can be null if it was deleted
                            continue;
                        }
                        insertTracksStatement += ` ($${index}, $${index + 1}),`;
                        index += 2;

                        insertTracksArray.push(playlist.uri);
                        insertTracksArray.push(track.uri);
                    }
                    
                    trackOffset += trackLimit;
                } while (trackTotal === null || trackOffset < trackTotal);

                insertTracksStatement = insertTracksStatement.slice(0, -1) + ' ON CONFLICT (playlist_uri, track_uri) DO NOTHING';
                if (insertTracksArray.length > 0) {
                    /* Statement will have final form of: (One query per playlist)
                        'INSERT INTO public.track_in_playlist(playlist_uri, track_uri) 
                        VALUES ($1, $2), (...),...,(...) ON CONFLICT (playlist_uri, track_uri) DO NOTHING'
                    */
                    db.query(insertTracksStatement, insertTracksArray);
                }
            }

            offset += limit;
        } while (total === null || offset < total);

        console.log('Insert Db Ended');
        db.query('UPDATE public.user SET ready=true WHERE uri = $1', [user.uri]);
    } catch (err) {
        console.error(err);
        // Delete user since data was unable to be stored correctly.
        db.query('DELETE FROM public.user WHERE uri=$1', [user.uri]);
    }
});

modifyDb.process(async (job) => {
    /**
     * Modifies the user's last updated field to now
     * Flushes out track_in_playlist and user_saved_playlist related to the user in question
     * It then queues up insertDb to insert in the new rows
     * 
     * Params (within job object):
     * user {object}: User to update within database
     */
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
    /**
     * Finds out whether user's data is within database, and if it is, whether or not it's stale.
     * Three possible Actions taken by worker
     * 1. Queue up insertDb
     * Occurs when the user is not within the database
     * 2. Queue up modifyDb
     * User is in the database but either the data is not ready to be served or it is stale
     * 3. Do nothing
     * User is in database, ready with valid data
     */

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

        } else if (!data.rows[0].ready || new Date() - data.rows[0].last_updated > staleDataTime) {
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