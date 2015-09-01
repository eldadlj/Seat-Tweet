var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');


/* Location pages. */
router.get('/', ctrlLocations.homeList);
router.get('/location', ctrlLocations.locationStream);
router.get('/location/review/new', ctrlLocations.addReview);

/* Other pages*/
router.get('/about', ctrlOthers.about);

module.exports = router;
