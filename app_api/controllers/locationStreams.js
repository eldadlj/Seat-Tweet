module.exports = function(io){
    var Twit = require('../../node_modules/twit/lib/twitter');
    var _ = require('lodash');
    var config = require('../../config');
    var mongoose = require('mongoose');
    var streamHandler = require('../utils/streamHandler');
    var Loc = mongoose.model('Location');
    var Tweet = mongoose.model('Tweet');
    var tweets = [];
    var currentRoom = [];
    
    var twit = new Twit(config); 
        var nsp = io.of('/seattweet');
        nsp.on('connection', function(socket){
            var streamH = new streamHandler();
            console.log('Someone connected');
            socket.on('join', function(room){
                console.log('Pre-join');
                if(_.isUndefined(nsp.adapter.rooms[room.newRoom])){
                    socket.leave(currentRoom[socket.id]);
                    socket.join(room.newRoom);
                    console.log('req location: '+ room.locationid);
                    Loc.findById(room.locationid).exec(function(err, location){
                        console.log('socketid: '+socket.id)
                        console.log('location id: '+ location.id);
                        console.log(location.hashtags_track + ',' + location.track);
                        var stream = twit.stream('statuses/filter', { track: location.hashtags_track +', ' + location.track, locations: location.geocode_rect});
                        streamH.createStream(stream, nsp, room.newRoom, location); 
                    });
                    
                }
                else{
                    socket.leave(currentRoom[socket.id]);
                    socket.join(room.newRoom);
                    console.log('Post-join');
                    console.log(nsp.adapter.rooms[room.newRoom]);
                }
                currentRoom[socket.id] = room.newRoom;
                
            });

            socket.on('leave', function(){
                console.log('leaving room');
                console.log('Pre-leave');
                console.log(nsp.adapter.rooms[currentRoom[socket.id]]);
                socket.leave(currentRoom[socket.id]);
                console.log('Post-leave');
                console.log(nsp.adapter.rooms[currentRoom[socket.id]]);
                streamH.closeStream();
            });
            
            socket.on('disconnect', function(){
                console.log('disconnecting');
                var r = currentRoom[socket.id];
                socket.leave(currentRoom[socket.id]);
                if(_.isUndefined(nsp.adapter.rooms[r]))
                    streamH.closeStream();
            });

        }); 
    
    //this is getting called on initial page load for a location
    this.locationStreams = function(req, res){
        if(req.query.lim){
            if(req.params && req.params.locationid){
                var limit = parseInt(req.query.lim);
                Tweet.getTweets(0, 0, limit, req.params.locationid, function(tweets){
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
        console.log('we are in the right place');
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
}