module.exports = function(io){
    var Twit = require('../../node_modules/twit/lib/twitter');
    var _ = require('lodash');
    var config = require('../../config');
    var mongoose = require('mongoose');
    var streamHandler = require('../utils/streamHandler');
    var twitterStreams = require('../config/twitterStreams');
    var Loc = mongoose.model('Location');
    var Tweet = mongoose.model('Tweet');
    var Token = mongoose.model('Token');
    var tweets = [];
    var currentRoom = [];
    var currentConfig = config;
     
        var nsp = io.of('/seattweet');
        nsp.on('connection', function(socket){
            //var streamH = new streamHandler();
            
            console.log('Someone connected');
            socket.on('join', function(room){
                //console.log(currentConfig);
                if(_.isUndefined(nsp.adapter.rooms[room.newRoom])){
                    checkLastStreamUsingToken(socket, room);
                }
                else{
                    socket.leave(currentRoom[socket.id]);
                    socket.join(room.newRoom);
                    console.log(nsp.adapter.rooms[room.newRoom]);
                }
                currentRoom[socket.id] = room.newRoom;
                
            });

            socket.on('leave', function(){
                var r = currentRoom[socket.id];
                console.log(r);
                socket.leave(currentRoom[socket.id]);
                if(_.isUndefined(nsp.adapter.rooms[r])){
                    checkShouldResetToken(r);
                }
            });
            
            socket.on('disconnect', function(){
                console.log('disconnecting');
                var r = currentRoom[socket.id];
                console.log(r);
                socket.leave(currentRoom[socket.id]);
                if(_.isUndefined(nsp.adapter.rooms[r])){
                    checkShouldResetToken(r);
                }
                
            });

        }); 
    
    //this is getting called on initial page load for a location
    this.locationStreams = function(req, res){
        if(req.query.lim){
            if(req.params && req.params.locationid){
                var limit = parseInt(req.query.lim);
                var skip = req.query.skip ? parseInt(req.query.skip) : 0;
                console.log(skip);
                Tweet.getTweets(0, skip, limit, req.params.locationid, function(tweets){
                    console.log(tweets.length);
                    sendJsonResponse(res, 200, tweets); 
                });
            }
        }else{
        if(req.params && req.params.locationid){ 
            //Now return to page data from db
            Tweet.getTweets(0,0,0, req.params.locationid, function(tweets){
                sendJsonResponse(res, 200, tweets);
            });
        }
        }
    };
    
    this.locationStreamsPage = function(req, res){
        if(req.params && req.params.locationid){
            Tweet.getTweets(req.params.page, req.params.skip, 0, req.params.locationid, function(tweets){
                sendJsonResponse(res, 200, tweets); 
            });
        }
    };
    
    this.locationNewStreams = function(req, res){
        if(req.params && req.params.locationid){
            
            var limit = parseFloat(req.query.lim);
            Tweet.getTweets(0, 0, req.params.locationid, function(tweets){
                sendJsonResponse(res, 200, tweets); 
            });
        }
    };
    
    var sendJsonResponse = function(res, status, content){
        res.status(status);
        res.json(content);
    };
    
    var startNewStream = function(socket, room){
        Token.findOne({
             $or: [
                 { active : false },
                 { "locations.primary" :{$eq: null} },
                 { "locations.secondary":{$eq:null}},
                 { "locations.secondary":{$eq:"locations.primary"}}
                 ]
         }).exec(function(err, availToken) {
             if(err){
                 console.log(err);
             }
             else{
                 console.log('availToken');
                 console.log(availToken);
                 streamData(availToken, room, socket)
             }
         });
        
    }
    
    var updateTokens = function(token, locationId, isPrimary){
        var updatedData;
        now = new Date();
        if(isPrimary){
            updatedData = {
                active: true,
                lastUsed: now,
                'locations.secondary': locationId
                }
            }
            else {
            updatedData = {
                active: true,
                lastUsed: now,
                'locations.primary' : locationId
                }
            }
        console.log('updatedData');
        console.log(updatedData);
        Token.update({token: token},updatedData, function(err,affected) {
                  console.log('affected Token rows %d', affected);
                });
    };
    
    var streamData = function(token, room, c_socket){
        if(token){
            updateTokens(token.token, room.newRoom, (!_.isEmpty(token.locations) && !_.isEmpty(token.locations.primary)));
            currentConfig.access_token = token.token;
            currentConfig.access_token_secret = token.tokenSecret;
        }
        console.log('currentConfig');
        console.log(currentConfig);
        c_socket.leave(currentRoom[c_socket.id]);
        c_socket.join(room.newRoom);
        console.log('new room: '+room.newRoom)
        var twit = new Twit(currentConfig);
        Loc.findById(room.locationid).exec(function(err, location){
            var streamH = new streamHandler();
            if(twitterStreams.getStream(room.locationid))
                twitterStreams.getStream(room.locationid).stop();
            
            var stream = twit.stream('statuses/filter', { track: location.hashtags_track +', ' + location.track, locations: location.geocode_rect});
            twitterStreams.addStream(room.locationid, stream);
            streamH.createStream(stream, nsp, room.newRoom, location); 
        });
    };
    
    var checkLastStreamUsingToken = function(socket, room){
        console.log(room.locationid);
        Token.findOne({
             $or: [
                 { "locations.primary" :{$eq: room.locationid}},
                 { "locations.secondary":{$eq:room.locationid}}
                 ]
         }).exec(function(err, tokenForLoc) {
             if(err){
                 console.log(err);
             }
             else if(tokenForLoc){
                 console.log('tokenForloc is');
                 console.log(tokenForLoc);

                 var updatedData;
                 var isActive = (_.isUndefined(tokenForLoc.locations.primary) && _.isUndefined(tokenForLoc.locations.secondary));
                 tokenForLoc.active = isActive;
                 if(tokenForLoc.locations.primary && tokenForLoc.locations.primary ==room.locationid){
                    tokenForLoc.locations.primary = undefined;
                 }
                 else{
                     tokenForLoc.locations.secondary = undefined;
                 }
                 tokenForLoc.save();
             }
            startNewStream(socket, room);
         });
    }
    
    var checkShouldResetToken = function(locationid){
        console.log('reseting token');
        Token.findOne({
             $or: [
                 { "locations.primary" :{$eq: locationid}},
                 { "locations.secondary":{$eq:locationid}}
                 ]
         }).exec(function(err, tokenForLoc) {
             if(err){
                 console.log(err);
             }
             else if(tokenForLoc){
                 console.log('tokenForloc is');
                 console.log(tokenForLoc);

                 var updatedData;
                 var isActive = (_.isUndefined(tokenForLoc.locations.primary) && _.isUndefined(tokenForLoc.locations.secondary));
                 tokenForLoc.active = isActive;
                 if(tokenForLoc.locations.primary && tokenForLoc.locations.primary ==locationid){
                    tokenForLoc.locations.primary = undefined;
                 }
                 else{
                     tokenForLoc.locations.secondary = undefined;
                 }
                 tokenForLoc.save();
             }
         });
        
    };
}