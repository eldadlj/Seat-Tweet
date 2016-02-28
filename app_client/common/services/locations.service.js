(function(){
    angular
        .module('seattweetApp')
        .service('locationsData', locationsData);
    
    locationsData.$inject = ['$http'];
    function locationsData ($http){
        var locationsList = function(){
            return $http.get('/api/locations');
        };
        
        var locationStreamsById = function(locationId){
            return $http.get('/api/location-stream/'+locationId);
        };
        
        var locationNewStreamsById = function(locationId, limit, skip){
            return $http.get('/api/location-stream/'+locationId+'?lim='+limit+'&skip='+skip);
        };
        
        var sportsForLocation = function(){
            return $http.get('/api/sportsForLocation');
        };
    
        return {
            locationsList: locationsList,
            locationStreamsById: locationStreamsById,
            locationNewStreamsById: locationNewStreamsById,
            sportsForLocation: sportsForLocation    
        };
    }
})();