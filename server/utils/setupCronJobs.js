var {handleWorkerLogs} = require('../workers/handleWorkerLogs');
var { clearDb } = require('../workers/clearDatabase');


async function setupCronJobs() {
    // Remove any leftover cron jobs from when server was last run
    handleWorkerLogs.getRepeatableJobs()
        .then(loggers => {
            for (let logger of loggers) {
                handleWorkerLogs.removeRepeatableByKey(logger.key);
            }
        })
        .catch(err => console.error(err))

    handleWorkerLogs.add({}, {
        repeat: {
            cron: '0 * * * *' // Every Hour https://crontab.cronhub.io/
        }
    });

    clearDb.getRepeatableJobs()
        .then(loggers => {
            for (let logger of loggers) {
                clearDb.removeRepeatableByKey(logger.key);
            }
        })
        .catch(err => console.error(err))

    clearDb.add({}, {
        repeat: {
            cron: '0 0 1 */6 *' // 1st day of every 6th month 
        }
    })
}

module.exports = { setupCronJobs };