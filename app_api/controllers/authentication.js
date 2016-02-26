var passport = require('passport');
var mongoose = require('mongoose');
//var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
          res.status(status);
          res.json(content);
};

module.exports.login = function(req, res) {
    console.log('twitter login');
    passport.authenticate('twitter');
};

module.exports.loging_cb = function(req, res){
    console.log('success :' +req.user);
}

module.exports.successLogin = function(req, res){
    console.log('success :');
    console.log(req);
}

module.exports.failLogin = function(req, res){
    console.log('failure :');
    console.log(req);
}