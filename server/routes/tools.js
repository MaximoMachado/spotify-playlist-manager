var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotifyApi');
var {searchPlaylistsForTrack} = require('../utils/searchPlaylistsForTrack');
var db = require('../db');

router.get('/multiple-playlist-searcher/:uri', async (req, res) => {
    /**
     * Based on a song uri, looks through every single playlist saved by the user
     * and returns the playlists that the specified song is within
     */

    const { uri } = req.params;

    const { body } = await spotifyApi.getMe();
    const user = body.uri;
    
    const statement = 'SELECT * FROM public.user WHERE uri=$1';
    const users = await db.query(statement, [user.uri]);
    
    let matchingPlaylists = [];
    const staleDataTime = parseInt(process.env.STALE_DATA_TIMEOUT);
    if (users.length > 0 && (new Date() - users[0].last_updated) < staleDataTime) {
        // TODO Use data in database to figure out matching playlists.

        const statement = 'SELECT playlist_uri FROM public.track_in_playlist \
                        USING public.user_saved_playlist \
                        WHERE public.track_in_playlist.playlist_uri = public.user_saved_playlist.playlist_uri \
                        AND public.user_saved_playlist.user_uri = $1 \
                        AND public.track_in_playlist.track_uri = $2';

        const playlistUris = await db.query(statement, [user.uri, uri]);

        if (playlistUris.length > 0) {
            matchingPlaylists = await spotifyApi.getUserPlaylists();

            matchingPlaylists = matchingPlaylists.filter(playlist => { playlistUris.includes(playlist.uri) })
        }
    } else {

        matchingPlaylists = await searchPlaylistsForTrack(uri);
    }
    
    res.send(matchingPlaylists);
});

module.exports = router;