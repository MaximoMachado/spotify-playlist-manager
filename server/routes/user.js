var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/settings/:uri', (req, res) => {
    const { uri } = req.params;

    db.query('SELECT settings FROM public.user WHERE public.user = $1', [uri])
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

router.post('/settings/:uri', (req, res) => {
    const { uri } = req.params;

    const { settings } = req.body;

    db.query('UPDATE public.user SET settings = $1 WHERE public.user = $2 RETURNING public.user.settings', [settings, uri])
        .then(rowData => {
            if (rowData.rowCount > 0) {
                res.status(201).send(rowData.rows[0]);
            } else {
                res.status(404).send('User does not exist');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Unable to ')
        })
});


module.exports = router;