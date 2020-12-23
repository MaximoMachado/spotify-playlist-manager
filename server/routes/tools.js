var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotifyApi');
var {searchPlaylistsForTrack} = require('../utils/searchPlaylistsForTrack');
var db = require('../db');

router.get('/multiple-playlist-searcher/:uri', async (req, res) => {
    /**
     * Based on a song uri, looks through every single playlist saved by the user
     * and returns the playlists that the specified song is within
     */

    const { uri } = req.params;

    const { body } = await spotifyApi.getMe();
    
    const statement = 'SELECT * FROM public.user WHERE uri=$1';
    const users = await db.query(statement, [body.uri]);
    
    let matchingPlaylists;
    const staleDataTime = 1000 * 60 * 60; // 1 Hour in Milliseconds
    if (users.length > 0 && (new Date() - users[0].last_updated) < staleDataTime) {
        // TODO Use data in database to figure out matching playlists.
        matchingPlaylists = [];
    } else {

        matchingPlaylists = await searchPlaylistsForTrack(uri);
    }
    
    res.send(matchingPlaylists);
});

module.exports = router;