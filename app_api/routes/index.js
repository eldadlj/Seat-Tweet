module.exports = function(io){
    var passport = require('passport');
    var express = require('express');
    var app = express();
    
    var router = express.Router();
    var ctrlLocations = require('../controllers/locations');
    var ctrlStreams = require('../controllers/locationStreams');
    var ctrlAuth = require('../controllers/authentication');
    var stream = new ctrlStreams(io);

    //Ctrl Locations
    router.get('/locations', ctrlLocations.locationslistAll);
    router.post('/locations', ctrlLocations.locationsCreate);
    router.get('/sportsForLocation', ctrlLocations.sportsForLocation);
    //router.get('/locations/:sportid', ctrlLocations.locationslistBySport);
    //router.get('/locations/:leagueid', ctrlLocations.locationslistByLeague);
    router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
    router.get('/location-stream/:locationid', stream.locationStreams);
    router.get('/login', passport.authenticate('twitter'));
    router.get('/login_cb', passport.authenticate('twitter', {
            successRedirect : '/successLogin',
            failureRedirect : '/failLogin'
        }));
    router.get('/successLogin', ctrlAuth.successLogin);
    router.get('/failLogin', ctrlAuth.failLogin);

    return router;
}