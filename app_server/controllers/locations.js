module.exports.homeList = function(req, res, next){
    res.render('locations-list', { 
        title: 'Seat-Tweet - Find the best tweets!',
        pageHeader: {
            title: 'Seat-Tweet',
            strapLine: 'Find the best tweets!'
        },
        locations: [{
            name: 'Albertsons Stadium',
            address: 'Boise, ID',
            rating: 4,
            sports: 'CFB',
            conference: 'MW',
            isTop25: true,
            geocode: "39.74388,-105.020097,0.25mi"
        },{
            name: 'LaVell Edwards Stadium',
            address: 'Provo, UT',
            rating: 4,
            sports: 'CFB',
            conference: 'Independent',
            isTop25: true,
            geocode: "39.74388,-105.020097,0.25mi" 
        },{
            name: 'Husky Stadium',
            address: 'Seattle, WA',
            rating: 5,
            sports: 'CFB',
            conference: 'Pac12',
            isTop25: false,
            geocode: "39.74388,-105.020097,0.25mi" 
        }],
        sports: [{
            name: 'CFB',
        },{
            name: 'NFL',
        },{
            name: 'NBA',
        }]
    });
};

module.exports.locationStream = function(req, res, next){
    res.render('location-stream', { title: 'Location Streams' });
};

module.exports.addReview = function(req, res, next){
    res.render('index', { title: 'Add Review' });
}