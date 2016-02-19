//wrapping angular application files in IIFEs for performance improvement
(function(){
    angular.module('seattweetApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngAnimate']);

    function config($routeProvider, $locationProvider){
        $routeProvider
        .when('/', {
            templateUrl: 'home/home.view.html',
            controller: 'homeCtrl',
            controllerAs: 'vm'
        })
        .when('/about', {
            templateUrl: '/common/views/genericText.view.html',
            controller: 'aboutCtrl',
            controllerAs: 'vm'
        })
        .when('/location-stream/:locationid', {
            templateUrl: '/locationStreams/locationStreams.view.html',
            controller: 'locationStreamsCtrl',
            controllerAs: 'vm'
        })
        .otherwise({redirectTo: '/'});
        
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

    angular
        .module('seattweetApp')
        .config(['$routeProvider', '$locationProvider', config]);
})();