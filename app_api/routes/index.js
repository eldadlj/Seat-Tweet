module.exports = function(io){
    var passport = require('passport');
    var express = require('express');
    var app = express();
    
    var router = express.Router();
    var ctrlLocations = require('../controllers/locations');
    var ctrlStreams = require('../controllers/locationStreams');
    var ctrlAuth = require('../controllers/authentication');
    var auth = new ctrlAuth(passport);
    var stream = new ctrlStreams(io);

    //Ctrl Locations
    router.get('/locations', ctrlLocations.locationslistAll);
    router.post('/locations', ctrlLocations.locationsCreate);
    router.get('/sportsForLocation', ctrlLocations.sportsForLocation);
    router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
    router.get('/location-stream/:locationid', stream.locationStreams);
    
    //twitter authentication
    router.get('/login', auth.login);// passport.authenticate('twitter'));
    router.get('/login_cb', auth.loging_cb);
    
    router.get('/successLogin', auth.successLogin);
    router.get('/failLogin', auth.failLogin);

    return router;
}