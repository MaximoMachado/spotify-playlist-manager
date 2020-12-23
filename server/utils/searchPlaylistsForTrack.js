var spotifyApi = require('../spotifyApi');

async function searchPlaylistsForTrack(uri) {
    const matchingPlaylists = [];

    let limit = 50;
    let offset = 0;
    let total = null;
    do {
        const playlistsData = await spotifyApi.getUserPlaylists({limit: limit, offset: offset});
        if (total === null) {
            total = playlistsData.body.total;
        }

        let playlists = playlistsData.body.items;
        for (let i = 0; i < playlists.length; i++) {
            let playlist = playlists[i];
            //console.log(playlist.name);
            let trackLimit = 100;
            let trackOffset = 0;
            let trackTotal = null;

            let foundInPlaylist = false;
            do {
                let tracksData = await spotifyApi.getPlaylistTracks(playlist.id, { limit: trackLimit, offset: trackOffset });
                let tracks = tracksData.body.items;

                if (trackTotal === null) {
                    trackTotal = tracksData.body.total;
                }

                for (let j = 0; j < tracks.length; j++) {
                    let track = tracks[j].track;
                    if (track.uri === uri) {
                        //console.log('Found');
                        matchingPlaylists.push(playlist);
                        foundInPlaylist = true;
                        break;
                    }
                }

                trackOffset += trackLimit;
            } while (!foundInPlaylist && (trackTotal === null || trackOffset < trackTotal));
        }

        offset += limit;
    } while (total === null || offset < total);

    return matchingPlaylists;
}

module.exports = {searchPlaylistsForTrack};