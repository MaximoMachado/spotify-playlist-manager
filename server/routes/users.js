var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
    const scopes = 'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';

    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.CLIENT_ID}` +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI));
});

module.exports = router;
