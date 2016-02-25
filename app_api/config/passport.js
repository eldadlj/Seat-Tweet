var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Token = mongoose.model('Token');
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
    callbackURL: config.callbackURL
  },
  function(token, tokenSecret, user, done) {
    console.log('using passport!!!!!!!!!!!!!!!!!!');
    // In this example, the user's Twitter profile is supplied as the user
    // record.  In a production-quality application, the Twitter profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    User.find({"twitter.id_str" : user.id}, function(err, db_user) {
        console.log('db_user is');
        console.log(db_user);
        console.log(err);
        if(db_user.length < 1){
            console.log('Could not found user');
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
                    var t = {
                        active: false,
                        user_id: user.id,
                        token: token,
                        tokenSecret: tokenSecret
                    };
                    var newToken = new Token(t);
                    newToken.save(function(err){
                        if(err){
                            console.log('token could not saved');
                        }
                    })
                    console.log('user saved successfuly');
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
                User.update({id_str: user.id},updatedData, function(err,affected) {
                  console.log('affected User rows %d', affected);
                });
                Token.update({user_id: user.id},updatedData, function(err,affected) {
                  console.log('affected Token rows %d', affected);
                });
            }
        }
    });
    console.log('at the end..........');
    return done(null, user);
  }));