var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
    const scopes = 'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';
    const redirect_uri = 'https://localhost:3000/tools';

    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.CLIENT_ID}` +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

module.exports = router;
