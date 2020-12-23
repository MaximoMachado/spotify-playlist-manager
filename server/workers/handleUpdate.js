var Queue = require('bull');
var spotifyApi = require('../spotifyApi');
var db = require('../db');
var { insertDb, updateDb, modifyDb } = require('./updateDb');

const handleUpdateQueue = new Queue('handle-update');

handleUpdateQueue.process(async (job) => {
    const res = await spotifyApi.getMe();
    const user = res.body;
    
    const rows = await db.query('SELECT * FROM public.user WHERE uri=$1', [user.uri]);
    

    const staleDataTime = parseInt(process.env.STALE_DATA_TIMEOUT);
    if (rows.length === 0) {
        // User not in database
        console.log(`${user.display_name}: User not in Db`)
        insertDb.add({ user: user });
    } else if (new Date() - rows[0].last_updated > staleDataTime) {
        // User in database and stale data
        console.log(`${user.display_name}: In Db and Stale Data`)
        modifyDb.add({ user: user });
    } else {
        // User in database and not stale data
        console.log(`${user.display_name}: In Db and Valid Data`)
    }
})

module.exports = handleUpdateQueue;