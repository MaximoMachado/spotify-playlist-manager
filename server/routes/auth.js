var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotifyApi');
var { handleUpdateQueue } = require('../workers/handleUpdate');

// Authentication with Spotify API
router.get('/login', (req, res, next) => {
    const scopes = ['playlist-modify-public', 'playlist-modify-private', 'playlist-read-private', 'playlist-read-collaborative'];

    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Something went wrong');
        } else {
            res.status(200).send('Successfully logged out.');
        }
    });
});

router.get('/callback', async (req, res, next) => {
    /**
     * Makes request for Spotify Access and Refresh Tokens
     * Also, periodically refreshes token if it is able to
     * 
     * Code from example authentication from spotify-web-api-node
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

            req.session.accessToken = access_token;
            req.session.refreshToken = refresh_token;
            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);

            console.log('access_token:', access_token);
            console.log('refresh_token:', refresh_token);

            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            );

            handleUpdateQueue.add({ accessToken: req.session.accessToken });
            res.redirect(`${process.env.ORIGIN_URL}/tools`);

            setInterval(async () => {
                // Set to correct user before refreshing
                spotifyApi.setRefreshToken(req.session.refreshToken);
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                //console.log('The access token has been refreshed!');
                //console.log('access_token:', access_token);

                req.session.accessToken = access_token;
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);
        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.redirect(`${process.env.ORIGIN_URL}`);
        });
});

module.exports = router;
