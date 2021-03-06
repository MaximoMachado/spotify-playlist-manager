var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var { pool } = require('./db');
var { setupCronJobs } = require('./utils/setupCronJobs');

var authRouter = require('./routes/auth');
var spotifyRouter = require('./routes/spotify');
var toolsRouter = require('./routes/tools');
var userRouter = require('./routes/user');

var app = express();

let sessionSecure = false;
let sessionProxy = false;
if (process.env.SERVER === 'prod') {
    // For reverse proxy through nginx
    app.enable('trust proxy');
    sessionSecure = true;
    sessionProxy = true;
}

setupCronJobs();

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

app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        proxy: sessionProxy,
        cookie: {
          secure: sessionSecure,
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
app.use('/user', userRouter);

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
