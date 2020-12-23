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
    const user = body;
    
    const statement = 'SELECT * FROM public.user WHERE uri=$1';
    const data = await db.query(statement, [user.uri]);
    
    let matchingPlaylists = [];
    const staleDataTime = parseInt(process.env.STALE_DATA_TIMEOUT);
    
    if (data.rowCount > 0 && (new Date() - data.rows[0].last_updated) < staleDataTime) {
        // TODO Use data in database to figure out matching playlists.
        console.log('Utilize Database');
        const statement = `SELECT DISTINCT public.track_in_playlist.playlist_uri FROM public.track_in_playlist, public.user_saved_playlist
                            WHERE public.user_saved_playlist.user_uri = $1
                            AND public.track_in_playlist.track_uri = $2`;

        const playlistData = await db.query(statement, [user.uri, uri]);

        if (playlistData.rowCount > 0) {
            const playlistUris = playlistData.rows.map(row => row.playlist_uri);

            const { body } = await spotifyApi.getUserPlaylists();
            const userPlaylists = body.items;
            
            matchingPlaylists = userPlaylists.filter(playlist => playlistUris.includes(playlist.uri));
        }
    } else {
        console.log('Utilize Spotify API');
        matchingPlaylists = await searchPlaylistsForTrack(uri);
    }
    
    res.send(matchingPlaylists);
});

module.exports = router;