var locationListCtrl = function($scope, locationData){
    $scope.message = "Searching for Locations";
    locationData.success(function(data){
        console.log('data is ' +data[0]);
        $scope.message = data.length > 0 ? "" : "No locations found";
        $scope.data = {locations: data};
    }).error(function(e){
        $scope.message = "Sorry, something's gone wrong ";
    });
};

var locationStreamCtrl = function($scope, locationStreamData, socket){
    $scope.message = "Searching for Streams";
    locationStreamData.success(function(data){
        socket.on('tweet', function(data){
        console.log('we have data');
        console.log(data);
        $scope.$apply(function(){
            $scope.data = {tweets: data};
        });
        });
    });
};

var ratingStars = function(){
    return {
        scope : {
            thisRating : '=rating'
        },
        templateUrl: '/angular/rating-start.html' 
    };
};

var locationData = function($http){
    return $http.get('/api/locations');
};

var locationStreamData = function($http){
    console.log("we are in locationStreamData");
    return $http.get('/api/location-stream/:2');
};

var socketioFactory = function($rootScope){
    var socket = io('/some-location');

    return {
        on: function(eventName, callback){
            socket.on(eventName, callback);
        },
        emit: function(eventName, data){
            socket.emit(eventName, data);
        }
    };
};

angular
    .module('seattweetApp', [])
    .controller('locationListCtrl', locationListCtrl)
    .controller('locationStreamCtrl', locationStreamCtrl)
    .directive('ratingStars', ratingStars)
    .service('locationData', locationData)
    .service('locationStreamData', locationStreamData)
    .factory('socket', ['$rootScope', socketioFactory]);