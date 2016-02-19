var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
    name: String,
    pnmae: String,
    teams: Array,
    sports: Array,
    leagues: Array,
    conference: Array,
    geocode_rect: Array,
    geocode_center: Array,
    coords: {type: [Number], index: '2dsphere'},
    rating: {type: Number, "default": 0, min: 0, max: 5},
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    path: String,
    hashtags: Array,
    hashtags_track: String,
    track: String,
    trackArray: Array
});

mongoose.model('Location', locationSchema);