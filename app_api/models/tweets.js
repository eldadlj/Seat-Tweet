var mongoose = require('mongoose');

var tweetSchema = new mongoose.Schema({
    location_id: String,
    date: Date,
    twid_str: String,
    text: String,
    retweeted_status_id_str: String,
    tweeted_from_location: Boolean,
    hashtags: Array,
    media_url: String,
    link_url: String,
    image_url: String,
    user_name: String,
    user_screen_name: String,
    user_id_str: String,
    coordinates: Array,
    place_name: String,
    place_type: String,
    retweet_count: Number,
    favorite_count: Number,
    lang: String,
});

//Create a static getTweet method to return tweet data from the db
tweetSchema.statics.getTweets = function(page, skip, limit, locationid, callback){
    var tweets = [];
    var start = (page * 10) +(skip*1);
    var lim = parseInt(limit) > 0 ? limit : 40;
    var sort = parseInt(limit) > 0 ? {date: -1} : {date: -1, favorite_count: -1, retweet_count: -1};

    Tweet.where('location_id').equals(locationid)
        .select('location_id twid twid_str date user text entities source retweet_count favorite_count lang location geo coordinates place active')
        .sort(sort).skip(start).limit(lim).exec(function(err, docs){
        //if everything is OK
        if(!err){
            console.log('got some tweets');
            tweets = docs;
            tweets.forEach(function(t){
                t.active = true;
            });
        }
        //pass them back to the specified callback
        callback(tweets);
    });
};

//return a Tweet model based on the defined schema
module.exports = Tweet = mongoose.model('Tweet', tweetSchema);