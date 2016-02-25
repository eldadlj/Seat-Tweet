
var streamCollection = [];


module.exports.addStream = function(locationId, streamHandler) {
    streamCollection[locationId] = streamHandler;
};

module.exports.getStream = function(locationId){
    return streamCollection[locationId];
}