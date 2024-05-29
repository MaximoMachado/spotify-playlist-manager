var Queue = require('bull');
var SpotifyWebApi = require('spotify-web-api-node');
var db = require('../db');

const clearDb = new Queue('clear-db', process.env.REDIS_URL);

clearDb.process(async (job) => {
    /**
     * Deletes all rows in track_in_playlist and user_saved_playlists in database. Unreadies all users so database isn't used.
     * Should be run every so often to prevent database from growing too large.
     */
    console.log(`${new Date().toLocaleString()} -- Clear Db Started:`);
    try {
    await db.query('UPDATE public.user SET ready=false');
    await Promise.all(db.query('DELETE FROM public.track_in_playlist'),
                db.query('DELETE FROM public.user_saved_playlist'),
                db.query('DELETE FROM public.track'));
        console.log(`${new Date().toLocaleString()} -- Clear Db Success`);
    } catch (err) {
        console.error(err);
        console.error(`${new Date().toLocaleString()} -- Clear Db Failure`);
    }
});

module.exports = {clearDb};