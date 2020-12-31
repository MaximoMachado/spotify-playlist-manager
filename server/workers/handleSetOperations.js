var Queue = require('bull');
var SpotifyWebApi = require('spotify-web-api-node');
var { getPlaylistTracks } = require('../utils/getAll');
var db = require('../db');
var validUserCache = require('../utils/validUserCache');

const union = new Queue('playlist-set-operations-union');
const intersection = new Queue('playlist-set-operations-intersection');
const difference = new Queue('playlist-set-operations-difference');
const symmetricDifference = new Queue('playlist-set-operations-symmetric-difference');


union.process(job => {
    const { playlists, differenceBasis } = job.data;
    console.log(job.data);
})

intersection.process(job => {
    const { playlists, differenceBasis } = job.data;
    console.log(job.data);
})

difference.process(job => {
    const { playlists, differenceBasis } = job.data;
    console.log(job.data);
})

symmetricDifference.process(job => {
    const { playlists, differenceBasis } = job.data;
    console.log(job.data);
})

module.exports = {union, intersection, difference, symmetricDifference};