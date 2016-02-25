var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    active: Boolean,
    user_id: String,
    token: String,
    tokenSecret: String,
    lastUsed: Date,
    locations: {
        primary: String,
        secondary: String
    }
});

mongoose.model('Token', tokenSchema);