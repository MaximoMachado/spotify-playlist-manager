var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var db = require('../db');

router.get('/settings/', async (req, res) => {
    const spotifyApi = new SpotifyWebApi({ accessToken: req.session.accessToken });
    const user = await spotifyApi.getMe().body;

    db.query('SELECT settings FROM public.user WHERE public.user = $1', [user.uri])
        .then(rowData => {
            if (rowData.rowCount > 0) {
                res.status(200).send(rowData.rows[0].settings);
            } else {
                res.status(404).send('User does not exist');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Unable to get user settings');
        })
});

router.post('/settings/', async (req, res) => {
    const { settings } = req.body;

    const spotifyApi = new SpotifyWebApi({ accessToken: req.session.accessToken });
    const user = await spotifyApi.getMe().body;

    db.query('UPDATE public.user SET settings = $1 WHERE public.user = $2 RETURNING public.user.settings', [settings, user.uri])
        .then(rowData => {
            if (rowData.rowCount > 0) {
                res.status(201).send(rowData.rows[0]);
            } else {
                res.status(404).send('User does not exist in database');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Unable to update settings');
        })
});


module.exports = router;