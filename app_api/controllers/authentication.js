var passport = require('passport');

var sendJSONresponse = function(res, status, content) {
          res.status(status);
          res.json(content);
};

module.exports.login = function(req, res) {
    passport.authenticate('twitter');
};

module.exports.loging_cb = function(req, res){
}

module.exports.successLogin = function(req, res){
}

module.exports.failLogin = function(req, res){
}