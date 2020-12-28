var Queue = require('bull');
var SpotifyWebApi = require('spotify-web-api-node');

const handlePlaylistShuffle = new Queue('handle-playlist-shuffle');

handlePlaylistShuffle.process(async (job) => {
    const { uri, accessToken } = job.data;

    try {
        const spotifyApi = new SpotifyWebApi({ accessToken: accessToken });

        const userRes = await spotifyApi.getMe();
        const user = userRes.body;

        const playlistRes = await spotifyApi.getPlaylist(uri);

    } catch (err) {
        console.error(err);
    }
});

module.exports = handlePlaylistShuffle;