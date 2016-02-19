var mongoose = require('mongoose');
var request = require('request');
var Loc = mongoose.model('Location');

var theEarth = (function(){
    var earthRadius = 6371; //in km
    
    var getDistanceFromRadius = function(rads){
        return parseFloat(rads * earthRadius);
    };
    
    var getRadiusFromDistance = function(distance){
        return parseFloat(distance / earthRadius);
    };
    
    return{
        getDistanceFromRadius : getDistanceFromRadius,
        getRadiunFromDistance : getRadiusFromDistance
    };
    
})();

module.exports.locationStreams = function(req, res){
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.locationslistAll = function(req, res){
    console.log("getting locations");
        Loc.find().exec(function(err, location){
            if(!location){
                sendJsonResponse(res, 404, {"message" : "location not found" });
                return;
            }
            else if(err){
                console.log(err);
                sendJsonResponse(res, 404, err);
                return;
            }
        sendJsonResponse(res, 200, location);
    });
};

module.exports.sportsForLocation = function(req, res){
    Loc.distinct('sports',function(err, sports){
        if(err){
            sendJsonResponse(res, 404, err);
            return;
        }
        sendJsonResponse(res, 200, sports);
    });
};

module.exports.locationslistBySport = function(req, res){
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.locationslistByLeague = function(req, res){
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.locationsCreate = function(req, res){
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.locationsReadOne = function(req, res){
    if(req.params && req.params.locationid)
    {
        Loc.findById(req.params.locationid).exec(function(err, location){
            if(!location){
                sendJsonResponse(res, 404, {"message" : "location not found :" + req.params.locationid });
                return;
            }
            else if(err){
                sendJsonResponse(res, 404, err);
                return;
            }
        sendJsonResponse(res, 200, location);
    });
    }
    else{
        sendJsonResponse(res, 404, {"message" : "No location id in request"});
    }
};

var sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};