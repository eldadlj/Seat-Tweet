module.exports = function(){
    var _ = require('lodash');
    var mongoose = require('mongoose');
    var Tweet = mongoose.model('Tweet');
    var currentStream;

    this.createStream = function(stream, nsp, room, location){
        currentStream = stream;
        //in case that there are too many retweets use t.retweeted_status
/*
    place_name: String,
    place_type: String,
  */
        currentStream.on('tweet', function(t){            
            var tweetInLocation = false;
            var tweet = {
                location_id: location.id,
                location_name: location.name,
                twid_str: t['id_str'],
                retweet_count: t['retweet_count'],
                favorite_count: t['favorite_count'],
                date: t['created_at'],
                text: t['text'],
                lang: t['lang'],
                coordinates: t['coordinates'],
            };
            var tweetEntry = new Tweet(tweet);
            tweetEntry.user_id_str = t.user.id_str;
            tweetEntry.user_name = t.user.name;
            tweetEntry.user_screen_name = t.user.screen_name;
            
            //We can also use location name in the future
            if(!_.isEmpty(t.coordinates)){
                var chunk = _.chunk(location.geocode_rect, 2);
                if(insidePolygon(t.coordinates, chunk)){
                    tweetInLocation = true;
                }
            }
                         
            if(!_.isEmpty(t.place)){
                tweetEntry.place_name = t.place.name;
                tweetEntry.place_type = t.place.place_type;
            }
            if(!_.isEmpty(t.entities.hashtags) && !tweetInLocation){
                tweetEntry.hashtags = t.entities.hashtags;
                tweetInLocation = containsLocationHashtags(t.entities.hashtags, location.hashtags);
            }
            if(!tweetInLocation){
                tweetInLocation = containsLocationTrack(tweet.text, location.trackArray);
            }
            if(tweetInLocation){
                tweetEntry.retweeted_status_id_str = _.isEmpty(t.retweeted_status) ? 0 : t.retweeted_status.id_str;

                if(t.entities.media){
                    Tweet.count(
                        {
                            $or: [
                                {"twid_str": tweetEntry.twid_str},
                                {"twid_str": tweetEntry.retweeted_status_id_str},
                                {"retweeted_status_id_str": tweetEntry.retweeted_status_id_str},
                                {"twid_str": t.entities.media[0].source_status_id_str}, 
                                {"entities.media.source_status_id_str": t.entities.media[0].source_status_id_str}
                            ]}).limit(1).exec(
                        function(err, docCount){
                            console.log('Count With Media ' +docCount);
                            if(docCount < 1){
                                tweetEntry.media_url = t.entities.media[0].media_url;
                                emitStream(tweetEntry, nsp, room);
                            }
                        });
                }
                else if(_.isEmpty(t.entities.urls) || (!_.isEmpty(t.entities.urls[0].display_url) && _.startsWith(t.entities.urls[0].display_url, 'instagram.com'))){
                    tweetEntry.image_url = (!_.isEmpty(t.entities.urls) && _.startsWith(t.entities.urls[0].display_url, 'instagram.com')) ? t.entities.urls[0].expanded_url : null;
                    Tweet.count(
                        { 
                            $or: [
                                {"twid_str": tweetEntry.twid_str},
                                {"twid_str": tweetEntry.retweeted_status_id_str},
                                {"retweeted_status_id_str": tweetEntry.retweeted_status_id_str}
                                ]},
                        function(err, docCount){
                            console.log('instagram? '+ tweetEntry.image_url)
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
            console.log('did save? '+err);
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

