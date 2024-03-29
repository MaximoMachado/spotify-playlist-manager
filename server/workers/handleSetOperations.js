var Queue = require('bull');
var SpotifyWebApi = require('spotify-web-api-node');
var { getPlaylistTracks } = require('../utils/getAll');
var db = require('../db');
var validUserCache = require('../utils/validUserCache');
var { addPlaylistQueue, handleUpdateQueue } = require('./handleUpdate');
var { combinations } = require('../utils/combinations');

const union = new Queue('playlist-set-operations-union', process.env.REDIS_URL);
const intersection = new Queue('playlist-set-operations-intersection', process.env.REDIS_URL);
const difference = new Queue('playlist-set-operations-difference', process.env.REDIS_URL);
const symmetricDifference = new Queue('playlist-set-operations-symmetric-difference', process.env.REDIS_URL);

const delay = ms => new Promise(res => setTimeout(res, ms));

union.process(async (job) => {
    const { playlists, differenceBasis, accessToken } = job.data;
    console.log('Union Started');
    try {
        const spotifyApi = new SpotifyWebApi({ accessToken: accessToken });

        const res = await spotifyApi.getMe();
        const user = res.body;

        const userQueryRes = await db.query('SELECT * FROM public.user WHERE uri=$1', [user.uri]);

        let tracks = [];
        if (validUserCache(userQueryRes)) {
            let statements = [];

            for (let i = 0; i < playlists.length; i++) {
                statements.push(`SELECT track_uri FROM public.track_in_playlist WHERE playlist_uri = $${i + 1}
                                AND public.track_in_playlist.track_uri NOT LIKE '%:local:%'`);
            }

            const joinStr = (userQueryRes.rows[0].settings.allowDuplicates) ? ' UNION ALL ' : ' UNION ';
            const statement = statements.join(joinStr);
            const tracksRes = await db.query(statement, playlists.map(playlist => playlist.uri));

            tracks = tracksRes.rows.map(row => row.track_uri);
        } else {
            for (let playlist of playlists) {
                const playlistId = playlist.uri.split(':')[2];
                for await (let playlistTrack of getPlaylistTracks(playlistId, accessToken)) {
                    if (!playlistTrack.is_local) {
                        tracks.push(playlistTrack.track.uri);
                    }
                }
            }
        }

        // TODO Decide whether to put playlists in name or description
        let newName = `Union of ` + playlists.map(playlist => `${playlist.name}`).join(' and ');
        newName = newName.slice(0, 100); // Limits to Spotify's 100 character limit

        const description = "Generated by Spotify Playlist Manager (www.spotifyplaylistmanager.net). Enjoy!";
        const newPlaylistRes = await spotifyApi.createPlaylist(newName, { public: true, description: description });
        const newPlaylist = newPlaylistRes.body;
        try {
            for (let i = 0; i < tracks.length; i += 100) {
                const trackSlice = tracks.slice(i, i + 100);
                await spotifyApi.addTracksToPlaylist(newPlaylist.id, trackSlice);
            }
            addPlaylistQueue.add({
                userUri: user.uri,
                playlistUri: newPlaylist.uri,
                trackUris: tracks,
            });
        } catch (err) {
            // In the case that the playlist cannot be added to, delete the newly created playlist
            console.error(err);
            await spotifyApi.unfollowPlaylist(newPlaylist.id);
        }
    } catch (err) {
        console.error(err);
    }
})

intersection.process(async (job) => {
    const { playlists, differenceBasis, accessToken } = job.data;
    console.log('Intersection Started');
    try {
        const spotifyApi = new SpotifyWebApi({ accessToken: accessToken });

        const res = await spotifyApi.getMe();
        const user = res.body;

        let userQueryRes;

        let tracks = [];
        let attempts = 0;
        let attemptLimit = 5;
        do {
            userQueryRes = await db.query('SELECT * FROM public.user WHERE uri=$1', [user.uri]);
            if (validUserCache(userQueryRes)) {
                let statements = [];

                for (let i = 0; i < playlists.length; i++) {
                    statements.push(`SELECT track_uri FROM public.track_in_playlist WHERE playlist_uri = $${i + 1}
                                    AND public.track_in_playlist.track_uri NOT LIKE '%:local:%'`);
                }

                const joinStr = (userQueryRes.rows[0].settings.allowDuplicates) ? ' INTERSECT ALL ' : ' INTERSECT ';
                const statement = statements.join(joinStr);
                const tracksRes = await db.query(statement, playlists.map(playlist => playlist.uri));

                tracks = tracksRes.rows.map(row => row.track_uri);
            } else {
                await delay(10000); // 10 seconds
                attempts++;
                if (attempts > attemptLimit) {
                    handleUpdateQueue.add({ accessToken: accessToken });
                    attempts = 0;
                    attemptLimit = attemptLimit * attemptLimit;
                }
            }
        } while (!validUserCache(userQueryRes));

        // TODO Decide whether to put playlists in name or description
        let newName = `Intersection of ` + playlists.map(playlist => `${playlist.name}`).join(' and ');
        newName = newName.slice(0, 100); // Limits to Spotify's 100 character limit

        const description = "Generated by Spotify Playlist Manager (www.spotifyplaylistmanager.net). Enjoy!";
        const newPlaylistRes = await spotifyApi.createPlaylist(newName, { public: true, description: description });
        const newPlaylist = newPlaylistRes.body;
        try {
            for (let i = 0; i < tracks.length; i += 100) {
                const trackSlice = tracks.slice(i, i + 100);
                await spotifyApi.addTracksToPlaylist(newPlaylist.id, trackSlice);
            }
            addPlaylistQueue.add({
                userUri: user.uri,
                playlistUri: newPlaylist.uri,
                trackUris: tracks,
            });
        } catch (err) {
            // In the case that the playlist cannot be added to, delete the newly created playlist
            console.error(err);
            await spotifyApi.unfollowPlaylist(newPlaylist.id);
        }
    } catch (err) {
        console.error(err);
    }
})

difference.process(async (job) => {
    const { playlists, differenceBasis, accessToken } = job.data;
    console.log('Difference Started');
    const basisName = playlists.find(playlist => playlist.uri === differenceBasis).name;
    try {
        const spotifyApi = new SpotifyWebApi({ accessToken: accessToken });

        const res = await spotifyApi.getMe();
        const user = res.body;

        let userQueryRes;

        let tracks = [];
        let attempts = 0;
        let attemptLimit = 5;
        do {
            userQueryRes = await db.query('SELECT * FROM public.user WHERE uri=$1', [user.uri]);
            if (validUserCache(userQueryRes)) {
                let statements = [];

                for (let i = 0; i < playlists.length; i++) {
                    statements.push(`SELECT track_uri FROM public.track_in_playlist WHERE playlist_uri = $${i + 1}
                                    AND public.track_in_playlist.track_uri NOT LIKE '%:local:%'`);
                }

                const joinStr = (userQueryRes.rows[0].settings.allowDuplicates) ? ' EXCEPT ALL ' : ' EXCEPT ';
                const statement = statements.join(joinStr);
                let values = playlists.map(playlist => playlist.uri).filter(uri => uri !== differenceBasis);

                // Place difference basis at the start
                values = [differenceBasis].concat(values);
                const tracksRes = await db.query(statement, values);

                tracks = tracksRes.rows.map(row => row.track_uri);
            } else {
                await delay(10000); // 10 seconds
                attempts++;
                if (attempts > attemptLimit) {
                    handleUpdateQueue.add({ accessToken: accessToken });
                    attempts = 0;
                    attemptLimit = attemptLimit * attemptLimit;
                }
            }
        } while (!validUserCache(userQueryRes));

        // TODO Decide whether to put playlists in name or description
        let newName = `${basisName} Subtracted By ` + playlists.filter(playlist => playlist.uri !== differenceBasis)
                                                                .map(playlist => `${playlist.name}`).join(' and ');
        newName = newName.slice(0, 100); // Limits to Spotify's 100 character limit

        const description = "Generated by Spotify Playlist Manager (www.spotifyplaylistmanager.net). Enjoy!";
        const newPlaylistRes = await spotifyApi.createPlaylist(newName, { public: true, description: description });
        const newPlaylist = newPlaylistRes.body;
        try {
            for (let i = 0; i < tracks.length; i += 100) {
                const trackSlice = tracks.slice(i, i + 100);
                await spotifyApi.addTracksToPlaylist(newPlaylist.id, trackSlice);
            }
            addPlaylistQueue.add({
                userUri: user.uri,
                playlistUri: newPlaylist.uri,
                trackUris: tracks,
            });
        } catch (err) {
            // In the case that the playlist cannot be added to, delete the newly created playlist
            console.error(err);
            await spotifyApi.unfollowPlaylist(newPlaylist.id);
        }
    } catch (err) {
        console.error(err);
    }
})

symmetricDifference.process(async (job) => {
    const { playlists, differenceBasis, accessToken } = job.data;
    console.log('Symmetric Difference Started');
    try {
        const spotifyApi = new SpotifyWebApi({ accessToken: accessToken });

        const res = await spotifyApi.getMe();
        const user = res.body;

        let userQueryRes;

        let tracks = [];
        let attempts = 0;
        let attemptLimit = 5;
        do {
            userQueryRes = await db.query('SELECT * FROM public.user WHERE uri=$1', [user.uri]);
            if (validUserCache(userQueryRes)) {
                let statements = [];
                let values = [];

                let unionStatements = [];
                let i = 0;
                for (i = 0; i < playlists.length; i++) {
                    values.push(playlists[i].uri);
                    unionStatements.push(`SELECT track_uri FROM public.track_in_playlist WHERE playlist_uri = $${i + 1}
                                    AND public.track_in_playlist.track_uri NOT LIKE '%:local:%'`);
                }
                let joinStr = (userQueryRes.rows[0].settings.allowDuplicates) ? ' UNION ALL ' : ' UNION ';
                statements.push(unionStatements.join(joinStr));

                
                // Gets intersections between every size of combinations of playlists to subtract from union
                for (let comboLength = 2; comboLength < playlists.length + 1; comboLength++) {
                    if (i > 10000) {
                        // Prevents Combinations that will never be completed to avoid hard stalling
                        break;
                    }
                    for (let combination of combinations(playlists, comboLength)) {
                        let selectStatements = [];

                        for (let playlist of combination) {
                            values.push(playlist.uri);
                            selectStatements.push(`SELECT track_uri FROM public.track_in_playlist WHERE playlist_uri = $${i + 1}
                            AND public.track_in_playlist.track_uri NOT LIKE '%:local:%'`);
                            i++;
                        }
                        joinStr = (userQueryRes.rows[0].settings.allowDuplicates) ? ' INTERSECT ALL ' : ' INTERSECT ';
                        statements.push(selectStatements.join(joinStr));
                    }
                }
                
                joinStr = (userQueryRes.rows[0].settings.allowDuplicates) ? ' EXCEPT ALL ' : ' EXCEPT ';
                const statement = statements.map(statement => `(${statement})`).join(joinStr);
                const tracksRes = await db.query(statement, values);

                tracks = tracksRes.rows.map(row => row.track_uri);
            } else {
                await delay(10000); // 10 seconds
                attempts++;
                if (attempts > attemptLimit) {
                    handleUpdateQueue.add({ accessToken: accessToken });
                    attempts = 0;
                    attemptLimit = attemptLimit * attemptLimit;
                }
            }
        } while (!validUserCache(userQueryRes));

        // TODO Decide whether to put playlists in name or description
        let newName = `Symmetric Difference of ` + playlists.map(playlist => `${playlist.name}`).join(' and ');
        newName = newName.slice(0, 100); // Limits to Spotify's 100 character limit

        const description = "Generated by Spotify Playlist Manager (www.spotifyplaylistmanager.net). Enjoy!";
        const newPlaylistRes = await spotifyApi.createPlaylist(newName, { public: true, description: description });
        const newPlaylist = newPlaylistRes.body;
        try {
            for (let i = 0; i < tracks.length; i += 100) {
                const trackSlice = tracks.slice(i, i + 100);
                await spotifyApi.addTracksToPlaylist(newPlaylist.id, trackSlice);
            }
            addPlaylistQueue.add({
                userUri: user.uri,
                playlistUri: newPlaylist.uri,
                trackUris: tracks,
            });
        } catch (err) {
            // In the case that the playlist cannot be added to, delete the newly created playlist
            console.error(err);
            await spotifyApi.unfollowPlaylist(newPlaylist.id);
        }
    } catch (err) {
        console.error(err);
    }
})

module.exports = {union, intersection, difference, symmetricDifference};