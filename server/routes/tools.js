var express = require('express');
var router = express.Router();
var {searchPlaylistsForTrack} = require('../utils/searchPlaylistsForTrack');
var { getUserPlaylists } = require('../utils/getAll');
var db = require('../db');
var { handleUpdateQueue, insertDb, modifyDb } = require('../workers/handleUpdate');
var handlePlaylistShuffle = require('../workers/handlePlaylistShuffle');
var SpotifyWebApi = require('spotify-web-api-node');
const validUserCache = require('../utils/validUserCache');

router.get('/multiple-playlist-searcher/:uri', async (req, res) => {
    /**
     * Based on a song uri, looks through every single playlist saved by the user
     * and returns the playlists that the specified song is within
     */

    const { uri } = req.params;

    const spotifyApi = new SpotifyWebApi({
        accessToken: req.session.accessToken
    });
    let user;
    try {
        const { body } = await spotifyApi.getMe();
        user = body;
    } catch (err) {
        console.error(err);
        res.send(err.statusCode).send('Something went wrong with getting your user data.');
        return;
    }
    
    let statement = 'SELECT * FROM public.user WHERE uri=$1';
    let userQueryRes = await db.query(statement, [user.uri]);
    
    let matchingPlaylists = [];
    
    if (userQueryRes.rowCount > 0 && !userQueryRes.rows[0].ready) {
        // Prevents the situation where the user's data is being cached into the database
        // and the user attempts to make a MPS search during this period
        // Waiting for the job to finish will prevent unneccessary rate limiting
        
        // Need to wait for all of these one by one since this is the flow of the jobs
        await handleUpdateQueue.whenCurrentJobsFinished();
        await modifyDb.whenCurrentJobsFinished();
        await insertDb.whenCurrentJobsFinished();

        // Redo query for user in case somehow worker failed and user isn't ready
        userQueryRes = await db.query('SELECT * FROM public.user WHERE uri=$1', [user.uri]);
    }
    
    const playlistsToExclude = (userQueryRes.rowCount > 0) ? new Set(userQueryRes.rows[0].settings.playlistsToExclude) : new Set();

    if (validUserCache(userQueryRes)) {
        // TODO Use data in database to figure out matching playlists.
        console.log('Utilize Database');
        const statement = `SELECT DISTINCT public.track_in_playlist.playlist_uri FROM public.track_in_playlist, public.user_saved_playlist
                            WHERE public.user_saved_playlist.user_uri = $1
                            AND public.track_in_playlist.track_uri = $2`;

        const playlistData = await db.query(statement, [user.uri, uri]);

        if (playlistData.rowCount > 0) {
            const playlistUris = playlistData.rows.map(row => row.playlist_uri);

            let validUris = new Set(playlistUris);
            for await (let playlist of getUserPlaylists(req.session.accessToken)) {
                if (validUris.has(playlist.uri) && !playlistsToExclude.has(playlist.uri)) {
                    matchingPlaylists.push(playlist);
                }
            }
        }
    } else {
        console.log('Utilize Spotify API');

        try {
            for await (let playlist of searchPlaylistsForTrack(uri, playlistsToExclude, req.session.accessToken)) {
                matchingPlaylists.push(playlist);
            }
            handleUpdateQueue.add({ accessToken: req.session.accessToken });
        } catch (err) {
            res.status(err.statusCode).send('Something went wrong with getting your playlists.');
            return;
        }
    }
    
    res.status(200).send(matchingPlaylists);
});

router.post('/true-random-shuffle/', async (req, res) => {
    const { uri, name } = req.body;

    handlePlaylistShuffle.add({ uri: uri, name: name, accessToken: req.session.accessToken });
    res.status(202).send('Playlist sent to handler for processing');
});

module.exports = router;