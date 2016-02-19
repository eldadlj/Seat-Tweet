(function(){
    angular
        .module('seattweetApp')
        .controller('aboutCtrl', aboutCtrl);
    
    function aboutCtrl(){
        var vm = this;
        
        vm.pageHeader = {
          title: 'About Seat-Tweet'  
        };
        
        vm.main = {
          content: 'The best fan streams from the best sports venues. \n\n The more your stream the higher you rank'  
        };
    }
})();