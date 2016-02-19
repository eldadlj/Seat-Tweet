(function(){
    angular
        .module('seattweetApp')
        .controller('leftNavigationCtrl', leftNavigationCtrl);
    
    leftNavigationCtrl.$inject = ['locationsData'];
    function leftNavigationCtrl(locationsData){
        var ln = this;
        
        locationsData.sportsForLocation().success(function(data){
            console.log(data);
            ln.sports = data;
        });
    }
})();