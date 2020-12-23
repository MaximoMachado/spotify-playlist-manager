var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotifyApi');
var {searchPlaylistsForTrack} = require('../utils/searchPlaylistsForTrack');

router.get('/multiple-playlist-searcher/:uri', async (req, res) => {
    /**
     * Based on a song uri, looks through every single playlist saved by the user
     * and returns the playlists that the specified song is within
     */

    const { uri } = req.params;

    const matchingPlaylists = await searchPlaylistsForTrack(uri);


    res.send(matchingPlaylists);
});

module.exports = router;