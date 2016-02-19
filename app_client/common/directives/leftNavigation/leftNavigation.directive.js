(function(){
    angular
        .module('seattweetApp')
        .directive('leftNavigation', leftNavigation);
    
    //controllerAs has to be unique hence if changing to vm it breaks
    function leftNavigation(){
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/leftNavigation/leftNavigation.template.html',
            controller: 'leftNavigationCtrl',
            controllerAs: 'ln'
        };
    }
})();