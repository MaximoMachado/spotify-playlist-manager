var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotifyApi');
var { getPagedPlaylists, getPagedTracks } = require('../utils/getPagedItems');

router.get('/:func', (req, res) => {
    /**
     * Allows any Spotify API function to be called that takes in no arguments and returns data.
     */
    const { func } = req.params;

    spotifyApi[func]()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.error(err);
        })
});

router.get('/search/playlists/:uri', (req, res) => {
    const { uri } = req.params;
    console.log('Uri: ' + uri);

    const matchingPlaylists = [];

    spotifyApi.getMe()
        .then(data => {
            const { id } = data.body;
            
            getPagedPlaylists(id, playlist => {
                const { id } = playlist;
                
                getPagedTracks(id, playlistTrack => {
                    const { track } = playlistTrack;

                    if (uri === track.uri) {
                        matchingPlaylists.push(playlist);
                        return true;
                    }
                    return false;
                })

                return false;
            });
        })
        .catch(err => console.error(err))

    res.send(matchingPlaylists);
});

module.exports = router;