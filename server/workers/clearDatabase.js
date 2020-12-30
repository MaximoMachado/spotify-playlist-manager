var Queue = require('bull');
var SpotifyWebApi = require('spotify-web-api-node');
var db = require('../db');

const clearDb = new Queue('clear-db');

clearDb.process((job) => {
    /**
     * Deletes all rows in track_in_playlist and user_saved_playlists in database. Unreadies all users so database isn't used.
     * Should be run every so often to prevent database from growing too large.
     */
    db.query('UPDATE public.user SET ready=false');
    db.query('DELETE FROM public.track_in_playlist');
    db.query('DELETE FROM public.user_saved_playlist');
});

module.exports = {clearDb};