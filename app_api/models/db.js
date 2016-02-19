var mongoose = require('mongoose');
require('./locations');
require('./tweets');
var dbURI = 'mongodb://localhost/Seat-Tweet';
if(process.env.NODE_ENV ==='production'){
    dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback){
    mongoose.connection.close(function(){
        console.log('Moongoos disconnected through ' + msg);
        callback();
    });
};

//For nodemon restarts
process.once('SIGUSR2', function(){
    gracefulShutdown('nodemon restart', function(){
        process.kill(process.pid, 'SIGUSR2');
    });
});
     
//For app termination
process.on('SIGINT', function(){
    gracefulShutdown('app termination', function(){
        process.exit(0);
    });
});

//For Heroku app termination
process.on('SIGTERM', function(){
    gracefulShutdown('Heruko app shutdown', function(){
        process.exit(0);
    });
});