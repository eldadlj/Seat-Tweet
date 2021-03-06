var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var uglifyJs = require('uglify-js');
var fs = require('fs');
var passport = require('passport');

require('./app_api/models/db');
require('./app_api/config/passport');
var app = express();
app.io = require('socket.io')();
//var nsp = io.of('/seattweet');

//var routes = require('./app_server/routes/index')(app.io);
var routesApi = require('./app_api/routes/index')(app.io);
var users = require('./app_server/routes/users');


// view engine setup
app.set('views', path.join(__dirname,'app_server', 'views'));
app.set('view engine', 'jade');

//minify all the necesary client files
var appClientFiles = [
    'app_client/app.js',
    'app_client/home/home.controller.js',
    'app_client/about/about.controller.js',
    'app_client/locationStreams/locationStreams.controller.js',
    'app_client/leftNavigation/leftNavigation.controller.js',
    'app_client/navigation/navigation.controller.js',
    'app_client/common/services/locations.service.js',
    'app_client/common/services/authentication.service.js',
    'app_client/common/factories/socket.factory.js',
    'app_client/common/directives/ratingStars/ratingStars.directive.js',
    'app_client/common/directives/footerGeneric/footerGeneric.directive.js',
    'app_client/common/directives/navigation/navigation.directive.js',
    'app_client/common/directives/leftNavigation/leftNavigation.directive.js',
    'app_client/common/directives/rightNavigation/rightNavigation.directive.js',
    'app_client/common/directives/pageHeader/pageHeader.directive.js',
    'app_client/common/directives/WindowEvents/windowScroll.directive.js',
    'app_client/common/directives/widgets/twitterWidgets.directive.js',
    'app_client/common/filters/addHtmlLineBreaks.filter.js'
];

var uglified = uglifyJs.minify(appClientFiles, {compress: false});

fs.writeFile('public/angular/seattweet.min.js', uglified.code, function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Script generated and saved: seattweet.min.js');
    }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'somesecret',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
//app.use(session({secret:'newSecretMEssageSeatTweet', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


//app.use('/', routes);
app.use('/api', routesApi);
app.use('/users', users);
app.use(function(req, res){
    res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app
