var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var { getUserPlaylists } = require('../utils/getAll');

router.get('/user-playlists', async (req, res, next) => {
    let playlists = [];
    try {
        for await (let playlist of getUserPlaylists(req.session.accessToken)) {
            playlists.push(playlist);
        }

        res.status(200).send(playlists);
    } catch (err) {
        console.error(err);
        next(createError(err.statusCode));
    }
});

router.get('/:func', (req, res, next) => {
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
                next(createError(err.statusCode));
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
                next(createError(err.statusCode));
            })
    }
});

module.exports = router;