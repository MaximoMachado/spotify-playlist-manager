var Queue = require('bull');
var SpotifyWebApi = require('spotify-web-api-node');
var db = require('../db');
const validUserCache = require('../utils/validUserCache');
const { getUserPlaylists, getPlaylistTracks } = require('../utils/getAll');

const handleUpdateQueue = new Queue('handle-update', process.env.REDIS_URL);
const addPlaylistQueue = new Queue('add-playlist', process.env.REDIS_URL);
const insertDb = new Queue('insert-db', process.env.REDIS_URL);
const modifyDb = new Queue('modify-db', process.env.REDIS_URL);


insertDb.process(async (job) => {
    /**
     * Gets the user's tracks within each playlist and stores them in the respective database tables
     * Allows for efficient checks of whether song is contained within a playlist and set operations
     * 
     * Params (within job object):
     * user {object}: User to update within database
     * accessToken {str}: Access Token from Spotify for User
     */
    console.log(`Insert Db Started:`);
    
    const { user, accessToken } = job.data;
    try {
        await db.query('INSERT INTO public.user(uri, last_updated) VALUES($1, $2) ON CONFLICT (uri) DO UPDATE SET last_updated=$3, ready=false', [user.uri, new Date(), new Date()]);
        
        for await (let playlist of getUserPlaylists(accessToken)) {
            // Add playlist to database
            const statement = 'INSERT INTO public.user_saved_playlist(user_uri, playlist_uri) VALUES($1, $2) ON CONFLICT (user_uri, playlist_uri) DO NOTHING';
            await db.query(statement, [user.uri, playlist.uri]);

            let tracksStatement = 'INSERT INTO public.track_in_playlist(playlist_uri, track_uri) VALUES';
            let tracksArray = [];
            let index = 1;
            let trackDetailsStatement = 'INSERT INTO public.track(uri, track_name, duration_ms, num_artists, first_artist_name) VALUES';
            let trackDetailsArray = [];
            let detailsIndex = 1;
            for await (let playlistTrack of getPlaylistTracks(playlist.id, accessToken)) {
                const { track } = playlistTrack;
                const { uri, name, artists, duration_ms } = track;
                tracksArray.push(playlist.uri);
                tracksArray.push(track.uri);

                tracksStatement += ` ($${index}, $${index + 1}),`;
                index += 2;

                trackDetailsArray.push(uri);
                trackDetailsArray.push(name);
                trackDetailsArray.push(duration_ms);
                trackDetailsArray.push(artists.length);
                trackDetailsArray.push(artists[0].name);

                trackDetailsStatement += ` ($${detailsIndex}, $${detailsIndex + 1}, $${detailsIndex + 2}, $${detailsIndex + 3}, $${detailsIndex + 4}),`;

                detailsIndex += 5;
            }

            // Add playlist tracks to database if they exist
            if (tracksArray.length > 0) {
                /* Statement will have final form of: (One query per playlist)
                    'INSERT INTO public.track(uri, track_name, duration_ms, num_artists, first_artist_name) 
                    VALUES ($1, $2, $3, $4, $5), (...),...,(...) ON CONFLICT (...) DO UPDATE'
                */
                trackDetailsStatement = trackDetailsStatement.slice(0, -1) + ' ON CONFLICT (uri) DO NOTHING';
                await db.query(trackDetailsStatement, trackDetailsArray);
                /* Statement will have final form of: (One query per playlist)
                    'INSERT INTO public.track_in_playlist(playlist_uri, track_uri) 
                    VALUES ($1, $2), (...),...,(...) ON CONFLICT (playlist_uri, track_uri) DO NOTHING'
                */
                tracksStatement = tracksStatement.slice(0, -1) + ' ON CONFLICT (playlist_uri, track_uri) DO NOTHING';
                db.query(tracksStatement, tracksArray);
            }
        }
        // Waits on this query so worker doesn't end before all queries do while
        await db.query('UPDATE public.user SET ready=true WHERE uri = $1', [user.uri]);
    } catch (err) {
        console.error(err);
        // Unready user since data was unable to be stored correctly.
        await db.query('UPDATE public.user SET ready=false WHERE uri = $1', [user.uri]);
    }
    console.log('Insert Db Ended');
});

modifyDb.process(async (job) => {
    /**
     * Modifies the user's last updated field to now
     * Flushes out track_in_playlist and user_saved_playlist related to the user in question
     * It then queues up insertDb to insert in the new rows
     * 
     * Params (within job object):
     * user {object}: User to update within database
     * accessToken {str}: Access Token from Spotify for User
     */
    console.log(`Modify Db Started:`);
    
    const { user, accessToken } = job.data;
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

        insertDb.add(job.data);
    } catch (err) {
        console.error(err);
    }
    console.log('Modify Db Ended');
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
     * 
     * Params (within job object):
     * accessToken {str}: Access Token from Spotify for User
     */

    console.log(`Handle Update Started:`);
    try {
        const { accessToken } = job.data;
        const spotifyApi = new SpotifyWebApi({
            accessToken: accessToken
        });
        const res = await spotifyApi.getMe();
        const user = res.body;
        
        const userQueryRes = await db.query('SELECT * FROM public.user WHERE uri=$1', [user.uri]);
        
        if (userQueryRes.rowCount === 0) {
            // User not in database
            console.log(`${user.display_name}: User not in Db`)
            insertDb.add({ user: user, accessToken: accessToken });

        } else if (!validUserCache(userQueryRes)) {
            // User in database and stale data
            console.log(`${user.display_name}: In Db and Stale Data`)
            modifyDb.add({ user: user, accessToken: accessToken });

        } else {
            // User in database and not stale data
            console.log(`${user.display_name}: In Db and Valid Data`)
        }
    } catch (err) {
        console.error(err);
    }
})

addPlaylistQueue.process(async (job) => {
    /**
     * Adds a specific playlist and its tracks for a user to the database
     * Expects the user to already be in the database
     * 
     * Params (within job object):
     * userUri {str}: Uri of Spotify User that has playlist saved
     * playlistUri {str}: Uri of playlist to add
     * trackUris {arr[str]}: Uris of tracks that are within the playlist
     */
    const { userUri, playlistUri, trackUris, } = job.data;
    console.log(`Add Playlist Started:\nUser: ${userUri} | Playlist: ${playlistUri} | Track #: ${trackUris.length}`);
    try {
        let statement = 'INSERT INTO public.user_saved_playlist(user_uri, playlist_uri) VALUES($1, $2) ON CONFLICT (user_uri, playlist_uri) DO NOTHING';
        await db.query(statement, [userUri, playlistUri]);

        statement = 'INSERT INTO public.track_in_playlist(playlist_uri, track_uri) VALUES';
        let values = [];
        let index = 1;
        for (let trackUri of trackUris) {
            values.push(playlistUri);
            values.push(trackUri);
            statement += ` ($${index}, $${index + 1}),`;
            index += 2;
        }

        if (values.length > 0) {
            statement = statement.slice(0, -1) + ' ON CONFLICT (playlist_uri, track_uri) DO NOTHING';
            await db.query(statement, values);
        }
    } catch (err) {
        console.error(err);
    }
});

module.exports = { handleUpdateQueue, addPlaylistQueue, insertDb, modifyDb };