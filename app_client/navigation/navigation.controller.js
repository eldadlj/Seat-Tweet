(function(){
    angular
        .module('seattweetApp')
        .controller('navigationCtrl', navigationCtrl);
    
    navigationCtrl.$inject = ['$location', 'authentication'];
    function navigationCtrl($location, authentication){
        var vm = this;
        
        vm.login = function(){
          authentication.login();  
        };
        
        vm.logout = function(){
            authentication.logout(); 
            $location.path('/');
        };
    }
    
})();