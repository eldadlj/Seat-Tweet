var mongoose = require('mongoose');

var tweetSchema = new mongoose.Schema({
    active: Boolean,
    location_id: String,
    metdata: Array,
    date: Date,
    twid: Number,
    twid_str: String,
    text: String,
    source: String,
    truncated: Boolean,
    in_reply_to_statud_id: Number,
    in_reply_to_statud_id_str: String,
    in_reply_to_user_id: Number,
    in_reply_to_user_id_str: String,
    retweeted_status_id_str: String,
    user: Array,
    geo: Array,
    coordinates: Array,
    place: Array,
    contributors: Array,
    retweet_count: Number,
    favorite_count: Number,
    entities: Array,
    favorited: Boolean,
    retweeted: Boolean,
    lang: String,
    location: Array
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