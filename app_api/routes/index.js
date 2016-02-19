module.exports = function(io){
    var express = require('express');
    var app = express();
    
    var router = express.Router();
    var ctrlLocations = require('../controllers/locations');
    var ctrlStreams = require('../controllers/locationStreams');
    var stream = new ctrlStreams(io);

    //Ctrl Locations
    router.get('/locations', ctrlLocations.locationslistAll);
    router.post('/locations', ctrlLocations.locationsCreate);
    router.get('/sportsForLocation', ctrlLocations.sportsForLocation);
    //router.get('/locations/:sportid', ctrlLocations.locationslistBySport);
    //router.get('/locations/:leagueid', ctrlLocations.locationslistByLeague);
    router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
    router.get('/location-stream/:locationid', stream.locationStreams);

    return router;
}