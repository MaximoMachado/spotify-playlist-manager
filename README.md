# Spotify Playlist Manager
### Live at www.spotifyplaylistmanager.net
Spotify Playlist Manager (SPM for short) is a website designed to utilize playlists in ways Spotify does not natively support. It is for Spotify users trying to get the most out of their playlists and feel limited by what is available.

# Tools
### Multiple Playlist Searcher
This tool looks through your saved playlists for a chosen song and tells you which playlists contain the song.

### True Random Shuffle
This tool creates a copy of the selected playlist but with the song ordering shuffled in a purely random manner.

### Playlist Set Operations
This tool creates a new playlist based on two or more other playlists using [set operations](https://en.wikipedia.org/wiki/Set_(mathematics)#Basic_operations):

i.e. an intersection would create a playlist containing only songs that are in both playlists

# Installation
`npm install`

Run this command in both the /client and /server directories to install the neccessary npm packages.

This app also requires the use of two databases, [Redis](https://redis.io/) and [PostGreSql](https://www.postgresql.org/).

No extra setup is required for Redis but the PostGreSql database requires specific columns and tables.

# PostGreSql Database Setup

Create a database and then import/restore `spm.sql` into it.

# ENV Configs
### /client
REACT_APP_PUBLIC_URL: Where the React site is being run

REACT_APP_API_URL: Where Node.js server is being run

### /server
#### [Spotify API](https://developer.spotify.com/documentation/web-api/quick-start/)
CLIENT_ID: Spotify API Client Id

CLIENT_SECRET: Spotify API Client Secret

REDIRECT_URI: Spotify redirects to this after login. Would recommend using `http://localhost:3001/auth/callback`

#### [Database](https://node-postgres.com/features/connecting)
DB_USER: User of database.

DB_HOST: Where database is being run. Likely `localhost`

DB_NAME: Name of database

DB_PASSWORD: Password of database

DB_PORT: Port database is running on

SESSION_SECRET: Secure string used for [express-session](https://www.npmjs.com/package/express-session)

STALE_DATA_TIMEOUT: Used to determine when to refresh database. Would recommend `3600000` ms (1 hour)

#### Misc
PORT: Port of Node.js Server. Would recommend `3001`

ORIGIN_URL: Url of Front-end. Would recommend `http://localhost:3000`


# Running
`npm start`

Run this command in both the /client and /server directories to start up the front-end and back-end servers respectively. 

You should then go to <http://localhost:3000>.


# Special Thanks

I just wanted to thank a couple people for helping debug and test the website as I developed it. Without their support, it would've been much, much harder to catch and fix bugs once the website was fully live.

- Justin Kwon
- Saba Zerefa
- Justin Witherspoon
- Edward McKeown
- Josh Barbell
- Ryan McLaughlin