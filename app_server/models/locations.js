var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
    name: String,
    pnmae: String,
    team: [String],
    geocode: String,
    coords: {type: [Number], index: '2dsphere'},
    rating: {type: Number, "default": 0, min: 0, max: 5},
    address: String,
    path: String
});

mongoose.model('Location', locationSchema);