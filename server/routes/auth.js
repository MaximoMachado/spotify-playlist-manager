var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotifyApi');
var handleUpdateQueue = require('../workers/handleUpdate');

// Authentication with Spotify API
router.get('/login', (req, res) => {
    const scopes = ['playlist-modify-public', 'playlist-modify-private', 'playlist-read-private', 'playlist-read-collaborative'];

    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

router.get('/callback', async (req, res) => {
    /**
     * Makes request for Spotify Access and Refresh Tokens
     * Also, periodically refreshes token if it is able to
     */

    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
        console.error('Callback Error:', error);
        res.redirect(`${process.env.ORIGIN_URL}`);
        return;
    }
  
    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);

            console.log('access_token:', access_token);
            console.log('refresh_token:', refresh_token);

            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            );

            handleUpdateQueue.add();
            res.redirect(`${process.env.ORIGIN_URL}/tools`);

            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);
        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.redirect(`${process.env.ORIGIN_URL}`);
        });
});

module.exports = router;
