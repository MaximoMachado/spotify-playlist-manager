var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

router.get('/:func', (req, res) => {
    /**
     * Allows any Spotify API function to be called that takes in no arguments or searches and returns the data.
     */
    const { func } = req.params;
    const { search, limit, offset } = req.query;

    const spotifyApi = new SpotifyWebApi({
        accessToken: req.session.accessToken
    });

    if (search === undefined) {
        spotifyApi[func]()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                console.error(err);
            })
    } else {
        const newLimit = (limit !== undefined && limit <= 50) ? limit : 20;
        const newOffset = (offset !== undefined && offset <= 2000) ? offset : 0;

        spotifyApi[func](search, { limit: newLimit, offset: newOffset })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                console.error(err);
            })
    }
});

module.exports = router;