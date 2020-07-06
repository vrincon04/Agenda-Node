// Modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config');
const Routers = require('./routers');

// Global
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('client'));
// Session
app.use(session({
    name: config.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: config.SESSION_SECRET,
    cookie: {
        maxAge: config.SESSION_LIFETIME,
        sameSite: true,
        secure: config.env === 'production'
    }
}));

// Routers
app.use('/user', Routers.User);
app.use('/events', Routers.Event);

module.exports = app;