var Queue = require('bull');
var SpotifyWebApi = require('spotify-web-api-node');
var { getPlaylistTracks } = require('../utils/getAll');
var shuffleArray = require('../utils/shuffleArray');

const handlePlaylistShuffle = new Queue('handle-playlist-shuffle');

handlePlaylistShuffle.process(async (job) => {
    const { uri, accessToken } = job.data;
    const playlistId = uri.split(':')[2];
    try {
        const spotifyApi = new SpotifyWebApi({ accessToken: accessToken });

        const res = await spotifyApi.getMe();
        const user = res.body;

        const trackUris = [];
        for await (let playlistTrack of getPlaylistTracks(playlistId, accessToken)) {
            trackUris.push(playlistTrack.track.uri);
        }

        shuffleArray(trackUris);

        const name = `SPM True Shuffle: ${playlistId}`;
        const newPlaylistRes = await spotifyApi.createPlaylist(user.id, name);
        const { newPlaylist } = newPlaylistRes.body;

        spotifyApi.addTracksToPlaylist(newPlaylist.id, trackUris);
    } catch (err) {
        console.error(err);
    }
});

module.exports = handlePlaylistShuffle;