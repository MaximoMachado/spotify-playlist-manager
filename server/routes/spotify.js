var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotifyApi');

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

module.exports = router;