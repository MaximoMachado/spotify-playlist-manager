var Queue = require('bull');
var { handleUpdateQueue, insertDb, modifyDb, addPlaylistQueue } = require('./handleUpdate');
var handlePlaylistShuffle = require('./handlePlaylistShuffle');

const handleWorkerLogs = new Queue('queue-logger', process.env.REDIS_URL);

handleWorkerLogs.process(async (job) => {
    try {
        const queues = {
            'Handle Update': handleUpdateQueue, 
            'Insert Db': insertDb, 
            'Modify Db': modifyDb, 
            'Add Playlist': addPlaylistQueue,
            'Handle Playlist Shuffle': handlePlaylistShuffle,
        };

        let loggingText = '--- WORKER LOGS START ---\n';
        loggingText += `Current Date and Time: ${new Date().toLocaleString()}\n`;

        for (let [key, queue] of Object.entries(queues)) {
            loggingText += `${key} Jobs:\n ${JSON.stringify(await queue.getJobCounts())}\n`;
        }
        loggingText += '--- WORKER LOGS END ---\n';
        console.log(loggingText);
    } catch (err) {
        console.error(err);
    }

});


module.exports = { handleWorkerLogs };
