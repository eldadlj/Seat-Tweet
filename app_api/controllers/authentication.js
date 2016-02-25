var passport = require('passport');
var mongoose = require('mongoose');
//var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
          res.status(status);
          res.json(content);
};

module.exports.login = function(req, res) {
    passport.authenticate('twitter');
};

module.exports.loging_cb = function(req, res){
    console.log('success :' +req,user)
}