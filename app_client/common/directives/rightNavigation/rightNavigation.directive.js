(function(){
    angular
        .module('seattweetApp')
        .directive('rightNavigation', rightNavigation);
    function rightNavigation(){
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/rightNavigation/rightNavigation.template.html'
        };
    }
})();