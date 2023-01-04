var SpotifyWebApi = require('spotify-web-api-node');
var { getPlaylistTracks, getUserPlaylists } = require('./getAll');

async function* searchPlaylistsForTrack(targetUri, playlistsToExclude, accessToken) {
    /**
     * Yields playlists track is in
     * Params:
     * targetUri {str}: Uri of track searching for
     * playlistsToExclude {Set}: Set of playlist uri's that will not be searched
     * accessToken {str}: Access Token provided by user authentication
     */
    
    const spotifyApi = new SpotifyWebApi({ accessToken: accessToken });

    const targetId = targetUri.split(":")[2];
    const response = await spotifyApi.getTrack(targetId);
    const targetTrack = response.body;
    
    for await (let playlist of getUserPlaylists(accessToken)) {
        if (playlistsToExclude.has(playlist.uri)) {
            continue;
        }
        
        for await (let playlistTrack of getPlaylistTracks(playlist.id, accessToken)) {
            let { track } = playlistTrack;
            let { uri, name, artists, duration_ms } = track;
            console.log(targetTrack);
            console.log(track);
            
            if (uri === targetTrack.uri) {

                yield playlist;
                break;
            } else if (name === targetTrack.name 
                            && duration_ms === targetTrack.duration_ms 
                            && artists.length === targetTrack.artists.length 
                            && artists[0].uri === targetTrack.artists[0].uri) {
                // To eliminate false negatives (because a song can have multiple uri's), we compare multiple features
                // This introduces false positives but it should be a very rare occurence compared to the false negatives
                // Only compare on duration and first artist name, it's very easy for a song to be posted under different albums
                // One as a "single" and one as the album version. I think most people would consider these to be the same song

                yield playlist;
                break;
            }
        }
    }
}

module.exports = {searchPlaylistsForTrack};