var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotifyApi');

router.get('/:func', (req, res) => {
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