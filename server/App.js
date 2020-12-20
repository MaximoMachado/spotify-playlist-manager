var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var spotifyApi = require('./spotifyApi');

var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const whitelist = [process.env.ORIGIN_URL, 'https://accounts.spotify.com']

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    
}));

app.use('/auth', authRouter);

app.get('/users/playlists', (req, res) => {
    spotifyApi.getMe()
        .then(data => {
            const user = data.body;

            spotifyApi.getUserPlaylists(user.id)
                .then(playlists => {
                    res.send(playlists);
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
