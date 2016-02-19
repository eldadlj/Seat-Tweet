var request = require('request');
var apiOptions = {
    server: "http://localhost:3000",
};

if(process.env.NODE_ENV === 'production'){
    apiOptions.server = "http://seat-tweet.herokuapp.com";
    
}

var _showError = function(req, res, status){
    var title, content;
    if( status === 404){
        title = "404, page not found";
        content = "Looks like we can't find this page...";
    }
    else{
        title = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong.";
    }
    res.status(status);
    res.render('generic-text', {
        title: title,
        content: content
    });
};

var renderHomePage = function(req, res){
    res.render('locations-list', { 
        title: 'Seat-Tweet - Find the best tweets!',
        pageHeader: {
            title: 'Seat-Tweet',
            strapLine: 'Find the best tweets!'
        },
        sports: [{
            name: 'CFB',
        },{
            name: 'NFL',
        },{
            name: 'NBA',
        }],
    });  
};

module.exports.homeList = function(req, res){
    renderHomePage(req, res);
};

module.exports.locationStream = function(req, res, next){
    res.render('location-stream', { title: 'Location Streams' });
};

module.exports.addReview = function(req, res, next){
    res.render('index', { title: 'Add Review' });
}