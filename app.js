var express = require('express');
var bodyParser = require('body-parser');
var router = require('./router');
var session = require('express-session');
var passport = require('passport');
var bodyParser  = require('body-parser');
var cookieParser = require('cookie-parser');

// Create app

var app = express()

// App config

app.set('port', process.env.PORT || 3000);
app.use(cookieParser());
app.use(session({
    secret: 'middleware',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}))

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.use(function (req, res, next) {
    console.log(req.body)
    next()
})

// Register routes
router.route(app)

//Start sever

app.listen(app.get('port'), function() {
    console.log('Server listening on process ' + process.pid + " and port " + app.get('port'));
})
