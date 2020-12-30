var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var db = require('../db');

router.get('/settings/', async (req, res, next) => {
    const spotifyApi = new SpotifyWebApi({ accessToken: req.session.accessToken });

    let user;
    try {
        const { body } = await spotifyApi.getMe();
        user = body;
    } catch (err) {
        res.status(err.statusCode).send('Spotify API encountered an error');
        return;
    }

    db.query('SELECT settings FROM public.user WHERE public.user.uri = $1', [user.uri])
        .then(rowData => {
            if (rowData.rowCount > 0) {
                res.status(200).send(rowData.rows[0].settings);
            } else {
                next(createError(404));
            }
        })
        .catch(err => {
            console.error(err);
            next(createError(500));
        })
});

router.post('/settings/', async (req, res, next) => {
    const { settings } = req.body;

    const spotifyApi = new SpotifyWebApi({ accessToken: req.session.accessToken });
    let user;
    try {
        const { body } = await spotifyApi.getMe();
        user = body;
    } catch (err) {
        res.status(err.statusCode).send('Spotify API encountered an error');
        return;
    }

    db.query('UPDATE public.user SET settings = $1 WHERE public.user.uri = $2 RETURNING public.user.settings', [settings, user.uri])
        .then(rowData => {
            if (rowData.rowCount > 0) {
                res.status(201).send(rowData.rows[0]);
            } else {
                next(createError(404));
            }
        })
        .catch(err => {
            console.error(err);
            next(createError(500));
        })
});


module.exports = router;