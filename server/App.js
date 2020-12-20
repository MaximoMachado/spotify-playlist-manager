var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');

var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/users', usersRouter);


// Callback to handle Spotify Login Request
app.get('/api/callback', async (req, res) => {
    const code = req.query.code || null;
    const error = req.query.error || null;

    if (code !== null) {
        // User accepted permissions
        const tokenRes = await axios.post('https://accounts.spotify.com/api/token', 
            {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
            },
            { 
                params: { 
                    client_id: process.env.CLIENT_ID, 
                    client_secret: process.env.CLIENT_SECRET 
                } 
            });


    } else {
        // Error

        res.redirect(process.env.FRONT_END_URL);
    }
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
