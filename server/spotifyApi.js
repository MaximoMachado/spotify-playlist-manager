var SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

module.exports = spotifyApi;