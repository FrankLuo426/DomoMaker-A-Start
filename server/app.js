/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable import/newline-after-import */
/* eslint-disable spaced-comment */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const redis = require('redis');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
// const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';
const dbURL = 'mongodb+srv://FrankLuo:luoyang20000426@cluster0.tlofu.mongodb.net/DomoMaker';

// Setup mongoose options to use newer functionality
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreatelndex: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => {
    if (err) {
        console.log('Could not connect to database');
        throw err;
    }
});

let redisURL = {
    hostname: 'redis-18501.c258.us-east-1-4.ec2.cloud.redislabs.com',
    port: 18501,
};

let redisPASS = 'SYjb00vDQFdF0qkmeJIoHb9fHRGOiA4H';
if (process.env.REDISCLOUD_URL) {
    redisURL = url.parse(process.env.REDISCLOUD_URL);
    [, redisPASS] = redisURL.auth.split(':');
}

const redisClient = redis.createClient({
    host: redisURL.hostname,
    port: redisURL.port,
    password: redisPASS,
});

// Pull in our routes
const router = require('./router.js');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use(session({
    key: 'sessionid',
    store: new RedisStore({
        client: redisClient,
    }),
    secret: 'Domo Arigato',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    },
}));

app.use(csrf());
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    console.log('Missing CSRF token');
    return false;
});

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

app.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Listening on port ${port}`);
});

router(app);