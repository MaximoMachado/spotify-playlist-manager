var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotifyApi');

router.get('/multiple-playlist-searcher/:uri', async (req, res) => {
    const { uri } = req.params;

    const matchingPlaylists = [];

    let limit = 50;
    let offset = 0;
    let total = null;
    do {
        const playlistsData = await spotifyApi.getUserPlaylists({limit: limit, offset: offset});
        if (total === null) {
            total = playlistsData.body.total;
        }

        let playlists = playlistsData.body.items;
        for (let i = 0; i < playlists.length; i++) {
            let playlist = playlists[i];
            console.log(playlist.name);
            let trackLimit = 100;
            let trackOffset = 0;
            let trackTotal = null;

            do {
                let tracksData = await spotifyApi.getPlaylistTracks(playlist.id, { limit: trackLimit, offset: trackOffset });
                let tracks = tracksData.body.items;

                if (trackTotal === null) {
                    trackTotal = tracksData.body.total;
                }

                for (let j = 0; j < tracks.length; j++) {
                    let track = tracks[j].track;
                    if (track.uri === uri) {
                        console.log('Found');
                        matchingPlaylists.push(playlist)
                    }
                }

                trackOffset += trackLimit;
            } while (trackTotal === null || trackOffset < trackTotal);
        }

        offset += limit;
    } while (total === null || offset < total);


    res.send(matchingPlaylists);
});

module.exports = router;