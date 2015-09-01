module.exports.homeList = function(req, res, next){
    res.render('locations-list', { title: 'Home' });
};

module.exports.locationStream = function(req, res, next){
    res.render('location-stream', { title: 'Location Streams' });
};

module.exports.addReview = function(req, res, next){
    res.render('index', { title: 'Add Review' });
}