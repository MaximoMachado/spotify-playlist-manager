var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var { pool } = require('./db');

var authRouter = require('./routes/auth');
var spotifyRouter = require('./routes/spotify');
var toolsRouter = require('./routes/tools');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN_URL,
}));

const sessionStore = new pgSession({
    pool: pool,
});

const secure = process.env.SERVER === 'prod';
app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
          secure: secure,
          httpOnly: true,
          maxAge: 1000 * 60 * 60 // Expires after an hour
        }
}));

app.use('/auth', authRouter);

app.use((req, res, next) => {
    // Authenication middleware
    if (req.session.accessToken) {
        next();
    } else {
        res.status(401).send('Invalid session. No access token.');
    }
});

app.use('/spotify', spotifyRouter);
app.use('/tools', toolsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    errorMessage = req.app.get('env') === 'development' ? err.message : 'Something went wrong';
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).send(errorMessage);
});

module.exports = app;
