(function(){
    angular
        .module('seattweetApp')
        .service('authentication', authentication);
    
    authentication.$inject = ['$http'];
    function authentication($http){
        var saveToken = function(token){
            //$windows.localStorage['seattweetApp'] = token;
        };
        
        var getToken = function(){
            //return $windows.localStorage['seattweetApp'];
        };
        
        var login = function(){
            return $http.get('/api/login'); //.success(function(data){
                //saveToken(data.token);
            //});
        };
        
        var logout = function(){
            //$windows.localStorage.removeItem('seattweetApp');
        };
        
        return{
            saveToken: saveToken,
            getToken: getToken,
            login: login,
            logout: logout
        };
    }
})();