const { Pool } = require('pg');

/**
 * Initialize PostGreSql Server
 */

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = {
    pool,
    // Code from PG package recommended logging for queries
    async query(text, params) {
      const start = Date.now();
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      
      const maxLength = 500;
      const query = (text.length > maxLength) ? text.slice(0, maxLength / 4) + ' ... ' + text.slice(maxLength * (3 / 4), maxLength) : text;
      //console.log('executed query', { query, duration, rows: res.rowCount });
      return res;
    },
    async getClient() {
      const client = await pool.connect();
      const query = client.query;
      const release = client.release;

      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!');
        console.error(`The last executed query on this client was: ${client.lastQuery}`);
      }, 5000)

      // monkey patch the query method to keep track of the last query executed
      client.query = (...args) => {
        client.lastQuery = args;
        return query.apply(client, args);
      }

      client.release = () => {
        // clear our timeout
        clearTimeout(timeout);
        // set the methods back to their old un-monkey-patched version
        client.query = query;
        client.release = release;
        return release.apply(client);
      }
      return client;
    }
  }
