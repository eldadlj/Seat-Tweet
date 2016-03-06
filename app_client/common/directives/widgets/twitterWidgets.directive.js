(function(){
    angular
        .module('seattweetApp')
        .directive('script', script);
    
    function script(){
        return {
            restrict: 'E',
            scope: false,
            link: function(scope, elem, attr){
                console.log('in Script');
                
                if(attr.type === 'text/javascript-lazy'){
                    console.log('in Script attr');
                    var code = elem.text();
                    var f = new Function(code);
                    f();
                }
            }
            
        };
    }
})();