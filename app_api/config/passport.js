var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('../../config');

// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('we are in serialize first');
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.find({"twitter.id_str" : id}, function(err, user) {
            done(err, user);
        });
    });

passport.use(new TwitterStrategy({
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    callbackURL: 'http://127.0.0.1:3000/api/login_cb'
  },
  function(token, tokenSecret, user, done) {
    // In this example, the user's Twitter profile is supplied as the user
    // record.  In a production-quality application, the Twitter profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    console.log(token + ' ' +tokenSecret);
    //console.log(user);
    //config.access_token = token;
    //config.access_token_secret = tokenSecret;
    //console.log(config.access_token + ' ' +config.access_token_secret);
    User.find({"twitter.id_str" : user.id}, function(err, db_user) {
        console.log(err);
        if(db_user.length < 1){
            var u = {
                twitter : {
                    id_str : user.id,
                    token : token,
                    tokenSecret : tokenSecret,
                    displayName  : user.displayName,
                    username     : user.username
                }
            };
            var newUser =  new User(u);
            newUser.save(function(err) {
                if (!err) {
                    console.log('user saved successfuly');
                }
            });
        }
    });
    return done(null, user);
  }));