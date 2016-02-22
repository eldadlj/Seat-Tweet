module.exports = function(){
    var request = require('request');
    var apiOptions = {
        server: "http://localhost:3000",
    };

    if(process.env.NODE_ENV === 'production'){
        apiOptions.server = "http://seat-tweet.herokuapp.com";
    }
    
    var renderLocationStream = function(req, res){
        res.render('location-stream', { 
            title: 'Location Streams',
            pageHeader: {
            title: 'BLEACHEERZ',
            strapLine: 'Find the best tweets!'
        },
        });
    };
    
    this.locationStream = function(req, res){
        renderLocationStream(req, res);
    };
};