(function(){
    angular
        .module('seattweetApp')
        .controller('locationStreamsCtrl', locationStreamsCtrl);
    //this is required to get the twitter widget because of angular related twitter bug

     function loadTweetsDelay(){
         setTimeout(function(){
            window.twttr.widgets.load();
                }, 500);
     }
    
    locationStreamsCtrl.$inject = ['$routeParams', 'locationsData', 'socket', '$scope' , '$document'];
    function locationStreamsCtrl($routeParams, locationsData, socket, $scope, $document){
        var vm = this;
        var streams = [];
        vm.newTweetsCount = 0;
        vm.totalStreamsLoaded = 0;
        vm.locationid = $routeParams.locationid;
        socket.init();
        socket.emit('join', {
            newRoom: vm.locationid,
            locationid: vm.locationid
        });
        
        locationsData.locationStreamsById(vm.locationid)
            .success(function(data){
                data.forEach(function(element, index){
                    element.containsInstagram = false;
                    element.date = new Date(element.date);
                    if(element.entities[0].urls.length > 0){
                        if(element.entities[0].urls[0].display_url.startsWith('instagram.com')){
                            element.instagram = element.entities[0].urls[0].expanded_url+'media/?size=m';
                            element.containsInstagram = true;
                        }   
                    }
                    streams.push(element);
                });
                socket.on('tweet', function(t){
                    vm.newTweetsCount++;
                    //t.date = new Date(t.date);
                    //streams.unshift(t);
                });
                vm.pageHeader = {
                    //title: vm.data.location.name
                };
            vm.data = { tweets: streams };
            vm.totalStreamsLoaded = vm.data.tweets.length;
            //window.onload();
            
        })
        .error(function(e){
            console.log(e);
        });
        
        $scope.loadNewStreams= function(){
            var limit = vm.newTweetsCount;
            vm.newTweetsCount = 0;
            locationsData.locationNewStreamsById(vm.locationid, limit)
            .success(function(data){
                data.forEach(function(element, index){
                    element.date = new Date(element.date);
                    element.containsInstagram = false;
                    if(element.entities[0].urls.length > 0){
                        if(element.entities[0].urls[0].display_url.startsWith('instagram.com')){
                            element.instagram = element.entities[0].urls[0].expanded_url+'media/?size=m';
                            element.containsInstagram = true;
                        }   
                    }
                    streams.push(element);
                });
                vm.data = { tweets: streams };
                vm.totalStreamsLoaded = vm.data.tweets.length;
            //alert(vm.totalStreamsLoaded);
                loadTweetsDelay();
            })
            .error(function(e){
                console.log(e);
            });
        }
        
        //TODO: Need to figure out the twitter load problem with angular
        $document.ready(function() {
            loadTweetsDelay();
        });
        
        
        $scope.$on("$destroy", function(){
            socket.emit('leave');
        });
    }
})();