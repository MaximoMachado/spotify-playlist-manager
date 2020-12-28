var { getPlaylistTracks, getUserPlaylists } = require('./getAll');

async function* searchPlaylistsForTrack(targetUri, accessToken) {
    /**
     * Yields playlists track is in
     * Params:
     * targetUri {str}: Uri of track searching for
     * accessToken {str}: Access Token provided by user authentication
     */
    for await (let playlist of getUserPlaylists(accessToken)) {
        for await (let playlistTrack of getPlaylistTracks(playlist.id, accessToken)) {
            let { track } = playlistTrack;
            
            if (track.uri === targetUri) {

                yield playlist;
                break;
            }
        }
    }
}

module.exports = {searchPlaylistsForTrack};