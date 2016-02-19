module.exports = function(){
    var _ = require('lodash');
    var mongoose = require('mongoose');
    var Tweet = mongoose.model('Tweet');
    var currentStream;

    this.createStream = function(stream, nsp, room, location){
        currentStream = stream;
        //in case that there are too many retweets use t.retweeted_status
        currentStream.on('tweet', function(t){            
            var tweetInLocation = false;
            var tweet = {
                location_id: location.id,
                twid: t['id'],
                twid_str: t['id_str'],
                date: t['created_at'],
                user: t['user'],
                text: t['text'],
                entities: t['entities'],
                source: t['source'],
                lang: t['lang'],
                location: t['location'],
                geo: t['geo'],
                coordinates: t['coordinates'],
            };
            var tweetEntry = new Tweet(tweet);
            
            //We can also use location name in the future
            if(tweet.geo != null){
                var chunk = _.chunk(location.geocode_rect, 2);
                if(insidePolygon(tweet.geo.coordinates, chunk)){
                    tweetInLocation = true;
                }
            }
            if(!_.isEmpty(tweet.entities.hashtags) && !tweetInLocation){
                tweetInLocation = containsLocationHashtags(tweet.entities.hashtags, location.hashtags);
            }
            if(!tweetInLocation){
                tweetInLocation = containsLocationTrack(tweet.text, location.trackArray);
            }
            if(tweetInLocation){
                console.log(_.isEmpty(t.retweeted_status));
                tweetEntry.retweeted_status_id_str = _.isEmpty(t.retweeted_status) ? 0 : t.retweeted_status.id_str;
                console.log(tweetEntry.retweeted_status_id_str);

                console.log('trying to emit '+tweet.twid_str);
                if(tweet.entities.media){
                    console.log('we have media');
                    Tweet.count(
                        {
                            $or: [
                                {"twid_str": tweet.twid_str},
                                {"twid_str": tweetEntry.retweeted_status_id_str},
                                {"retweeted_status_id_str": tweetEntry.retweeted_status_id_str},
                                {"twid_str": tweet.entities.media[0].source_status_id_str}, 
                                {"entities.media.source_status_id_str": tweet.entities.media[0].source_status_id_str}
                            ]}).limit(1).exec(
                        function(err, docCount){
                            console.log('Count With Media ' +docCount);
                            if(docCount < 1){
                                emitStream(tweetEntry, nsp, room);
                            }
                        });
                }
                else if((tweet.entities.urls.display_url && tweet.entities.urls[0].display_url.startsWith('instagram.com')) || _.isEmpty(tweet.entities.urls)){
                    Tweet.count(
                        { 
                            $or: [
                                {"twid_str": tweet.twid_str},
                                {"twid_str": tweetEntry.retweeted_status_id_str},
                                {"retweeted_status_id_str": tweetEntry.retweeted_status_id_str}
                                ]},
                        function(err, docCount){
                            console.log('Count ' +docCount);
                            if(docCount < 1){
                                emitStream(tweetEntry, nsp, room);
                            }
                        });
                }
                }
        });
    };

    this.closeStream = function(){
        if(currentStream)
            currentStream.stop();
    };
    
    var emitStream = function(t_stream, t_nsp, room){
        t_stream.save(function(err) {
            if (!err) {
                t_nsp.to(room).emit('tweet', t_stream.twid_str);
            }
        });
    }
    
    var insidePolygon = function (point, vs) {
        //coordinates are reversed so taking care of it here
        var x = point[1], y = point[0];
        
        var inside = false;
        
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = parseFloat(vs[i][0]), yi = parseFloat(vs[i][1]);
            var xj = parseFloat(vs[j][0]), yj = parseFloat(vs[j][1]);
            

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) 
                inside = !inside;
        }
        return inside;
    };
    
    var containsLocationHashtags = function(tweetHash, locationHash)
    {
        var result = false;
        _(locationHash).forEach(function(l){
           _(tweetHash).forEach(function(t){
               if(l == '#'+_.toLower(t.text)){
                   result = true;
                   return result;
               }
           });
        });
        return result;
    };
    
    var containsLocationTrack = function(text, locationTrack)
    {
        var result = false;
        _(locationTrack).forEach(function(l){
           if(_.toLower(text).indexOf(l) >= 0) {
                   result = true;
                   return result;
               }
           });
        return result;
    };
}

