const spotifyApi = require("../spotifyApi");

function getPagedItems(id, limit, offset, spotifyApiFunc, callback) {
    let total = null;

    while (total === null || offset < total) {
        spotifyApiFunc(id, {limit: limit, offset: offset})
            .then(data => {
                if (total === null) {
                    // Set total playlists once we know what it is
                    total = data.total;
                }

                const items = data.items;

                for (let i = 0; i < playlists.length; i++) {
                    const breakForLoop = callback(items[i]);
                    if (breakForLoop) {
                        break;
                    }
                }

            })
            .catch(err => console.error(err))

        offset += limit;
    }
}

function getPagedPlaylists(id, callback) {
    getPagedItems(id, 50, 0, spotifyApi.getUserPlaylists, callback);
}

function getPagedTracks(id, callback) {
    getPagedItems(id, 100, 0, spotifyApi.getPlaylistTracks, callback);
}


module.exports = { getPagedPlaylists, getPagedTracks };