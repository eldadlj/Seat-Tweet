module.exports = function(passport){
    
    var sendJSONresponse = function(res, status, content) {
              res.status(status);
              res.json(content);
    };

    this.login = function(req, res) {
        console.log(passport);
        passport.authenticate('twitter');
    };

    this.loging_cb = function(req, res){
        console.log('in cb');
        console.log(req);
        console.log(res);
        passport.authenticate('twitter', {
            successRedirect : '/successLogin',
            failureRedirect : '/failLogin'
        });
    };

    this.successLogin = function(req, res){
    };

    this.failLogin = function(req, res){
    };
}