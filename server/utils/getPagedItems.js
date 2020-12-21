const spotifyApi = require("../spotifyApi");

function getPagedItems(id, limit, offset, spotifyApiFunc, callback) {
    let total = null;

    while (total === null || offset < total) {
        spotifyApi[spotifyApiFunc](id, {limit: limit, offset: offset})
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
    console.log('Playlist: ' + id);
    getPagedItems(id, 50, 0, 'getUserPlaylists', callback);
}

function getPagedTracks(id, callback) {
    console.log('Track: ' + id);
    getPagedItems(id, 100, 0, 'getPlaylistTracks', callback);
}


module.exports = { getPagedPlaylists, getPagedTracks };