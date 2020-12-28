var SpotifyWebApi = require('spotify-web-api-node');

async function* getAll(spotifyApiFunc, id, limit, accessToken) {
    /**
     * Gets all items from every page from the Spotify API
     * 
     * Params:
     * spotifyApiFunc {str}: Name of Spotify API Function to use
     * id {int}: First argument of spotifyApiFunc, use null if spotifyApiFunc doesn't take first argument
     * limit {int}: Number of items to request per page
     * accessToken {str}: Access Token provided by user authentication
     */

    const spotifyApi = new SpotifyWebApi({ accessToken: accessToken });

    let total = 0;
    let offset = 0;
    do {
        let data;
        if (id === null) {
            data = await spotifyApi[spotifyApiFunc]({ limit: limit, offset: offset });
        } else {
            data = await spotifyApi[spotifyApiFunc](id, { limit: limit, offset: offset });
        }
        let items = data.body.items;

        if (total === null) {
            total = data.body.total;
        }

        for (let j = 0; j < items.length; j++) {
            yield items[j];
        }
        
        offset += limit;
    } while (total === null || offset < total);
}

 async function* getUserPlaylists(accessToken) {
    /**
     * Gets all playlists that a user follows
     * Params:
     * accessToken {str}: Access Token provided by user authentication
     */
    for await (let playlist of getAll('getUserPlaylists', null, 100, accessToken)) {
        yield playlist;
    }
}

async function* getPlaylistTracks(playlistId, accessToken) {
    /**
     * Async generator that gets all tracks of a playlist
     * Params:
     * playlistId {int}: Playlist to get tracks for
     * accessToken {str}: Access Token provided by user authentication
     */

    for await (let track of getAll('getPlaylistTracks', playlistId, 50, accessToken)) {
        if (track.track === null) {
            // Tracks that cannot be played (deleted) are null
            continue;
        }
        yield track;
    }
}

module.exports = { getUserPlaylists, getPlaylistTracks };