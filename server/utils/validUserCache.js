function validUserCache(queryRes) {
    /**
     * Checks whether the user's data exists and is valid
     * Params:
     * queryRes {obj}: Response from database selecting user based on Spotify uri
     */
    const staleDataTime = parseInt(process.env.STALE_DATA_TIMEOUT);

    return queryRes.rowCount > 0 && queryRes.rows[0].ready && (new Date() - queryRes.rows[0].last_updated) < staleDataTime;
}

module.exports = validUserCache;

