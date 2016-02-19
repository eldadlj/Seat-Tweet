module.exports = function(io){
    var express = require('express');
    var router = express.Router();
    var ctrlLocations = require('../controllers/locations');
    var CtrlLocationStreams = require('../controllers/locationStreams');
    var ctrlOthers = require('../controllers/others');
    
    var ctrLStreams = new CtrlLocationStreams();

    /* Location pages. */
    //Setting up the frame of our SPA
    router.get('/', ctrlOthers.angularApp);
    
    /*
    router.get('/', ctrlLocations.homeList);
    router.get('/location', ctrlLocations.locationStream);
    router.get('/location/review/new', ctrlLocations.addReview);
    router.get('/location-stream/:locationid', ctrLStreams.locationStream)
    */
    /* Other pages*/
    router.get('/about', ctrlOthers.about);

    return router;
}
