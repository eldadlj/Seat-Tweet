var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Token = mongoose.model('Token');
var config = require('../../config');

// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.find({"twitter.id_str" : id}, function(err, user) {
            console.log(err);
            console.log(user);
            done(err, user);
        });
    });

passport.use(new TwitterStrategy({
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    callbackURL: config.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
    User.find({"twitter.id_str" : profile.id}, function(err, db_user) {
        console.log(db_user);
        console.log(err);
        if(db_user.length < 1){
            var u = {
                twitter : {
                    id_str : profile.id,
                    token : token,
                    tokenSecret : tokenSecret,
                    displayName  : profile.displayName,
                    username     : profile.username
                }
            };
            var newUser =  new User(u);
            newUser.save(function(err) {
                if (!err) {
                    var t = {
                        active: false,
                        user_id: profile.id,
                        token: token,
                        tokenSecret: tokenSecret
                    };
                    var newToken = new Token(t);
                    newToken.save(function(err){
                    })
                }
            });
        }
        else{
            var updatedData;
            if(token.length > 0 && tokenSecret.length > 0){
                updatedData = {
                    token: token,
                    tokenSecret: tokenSecret 
                };
            }
            else if(token.length > 0 && tokenSecret.length < 1){
                updatedData = {
                    token: token
                };
            }
            else if(token.length < 1 && tokenSecret.length > 0){
                updatedData = {
                    tokenSecret: tokenSecret
                };
            }
            if(updatedData){
                User.update({id_str: profile.id},updatedData, function(err,affected) {
                });
                Token.update({user_id: profile.id},updatedData, function(err,affected) {
                });
            }
        }
    });
    });
    return done(null, profile);
  }));