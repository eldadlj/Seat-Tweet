var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    },
    twitter          : {
        id_str         : String,
        token        : String,
        tokenSecret : String,
        displayName  : String,
        username     : String
    }
});

mongoose.model('User', userSchema);