(function(){
    angular
        .module('seattweetApp')
        .controller('homeCtrl', homeCtrl);

    //Only use $scope when you actually need it; use the View- Model controllerAs approach where you can.
    //If need to use $apply then use $scope, don't forget to inject $scope into the controller
    //the injection is needed everywhere because we minimize our js scripts otherwise, angular doesn't work
    homeCtrl.$inject = ['locationsData'];
    function homeCtrl (locationsData){
        var vm = this;
        vm.pageHeader = {
            title: 'BLEACHEERZ',
            strapline: 'Find the best tweets from sporting events'
        };
        vm.sports = [{
                name: 'CFB',
            },{
                name: 'NFL',
            },{
                name: 'NBA',
            }];
        vm.message = "Searching for Locations";
        locationsData.locationsList().success(function(data){
            //console.log('data is ' +data[0]);
            vm.message = data.length > 0 ? "" : "No locations found";
            vm.data = {locations: data};
        }).error(function(e){
            vm.message = "Sorry, something's gone wrong ";
        })
    }
})();