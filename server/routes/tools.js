var express = require('express');
var router = express.Router();
var {searchPlaylistsForTrack} = require('../utils/searchPlaylistsForTrack');
var db = require('../db');
var { handleUpdateQueue } = require('../workers/handleUpdate');
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
    const { body } = await spotifyApi.getMe();
    const user = body;
    
    const statement = 'SELECT * FROM public.user WHERE uri=$1';
    const userQueryRes = await db.query(statement, [user.uri]);
    
    let matchingPlaylists = [];
    
    if (validUserCache(userQueryRes)) {
        // TODO Use data in database to figure out matching playlists.
        console.log('Utilize Database');
        const statement = `SELECT DISTINCT public.track_in_playlist.playlist_uri FROM public.track_in_playlist, public.user_saved_playlist
                            WHERE public.user_saved_playlist.user_uri = $1
                            AND public.track_in_playlist.track_uri = $2`;

        const playlistData = await db.query(statement, [user.uri, uri]);

        if (playlistData.rowCount > 0) {
            const playlistUris = playlistData.rows.map(row => row.playlist_uri);

            let limit = 50;
            let offset = 0;
            let total = null;
            do {
                const playlistsData = await spotifyApi.getUserPlaylists({limit: limit, offset: offset});
                if (total === null) {
                    total = playlistsData.body.total;
                }
        
                let playlists = playlistsData.body.items;
                matchingPlaylists = matchingPlaylists.concat(playlists.filter(playlist => playlistUris.includes(playlist.uri)));

                offset += limit;
            } while (total === null || offset < total);
        }
    } else {
        console.log('Utilize Spotify API');

        for await (let playlist of searchPlaylistsForTrack(uri, req.session.accessToken)) {
            matchingPlaylists.push(playlist);
        }
        handleUpdateQueue.add({ accessToken: req.session.accessToken });
    }
    
    res.send(matchingPlaylists);
});

router.post('/true-random-shuffle/', async (req, res) => {
    const { uri } = req.body;

    handlePlaylistShuffle.add({ uri: uri, accessToken: req.session.accessToken });
    res.status(202).send('Playlist sent to handler for processing');
});

module.exports = router;