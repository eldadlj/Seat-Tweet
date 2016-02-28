(function(){
    angular
        .module('seattweetApp')
        .directive('windowScroll', windowScroll);
    
    function windowScroll(){
        return function(scope, elem, attr){
            var raw = elem[0];
            
            var checkWindowBounds = function(evt){
                var rectObject = raw.getBoundingClientRect();
                if(rectObject.bottom <= window.innerHeight){
                    scope.$apply(attr.windowScroll);
                }
            };
          angular.element(window).bind('scroll load', checkWindowBounds);  
        };
    }
})();
    