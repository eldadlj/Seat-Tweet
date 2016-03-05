(function(){
    window.twttr = (function(d, s, id) {
        console.log(d.getElementsByTagName(s));
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
        console.log(js);
  js.async=false;
  fjs.parentNode.insertBefore(js, fjs);
 
  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };
 
  return t;
}(document, "script", "twitter-wjs"));
    angular
        .module('seattweetApp')
        .controller('locationStreamsCtrl', locationStreamsCtrl);
    
    locationStreamsCtrl.$inject = ['$routeParams', 'locationsData', 'socket', '$scope' , '$document', '$timeout'];
    function locationStreamsCtrl($routeParams, locationsData, socket, $scope, $document, $timeout){
        var vm = this;
        var streams = [];
        vm.newTweetsCount = 0;
        vm.totalStreamsLoaded = 0;
        vm.locationid = $routeParams.locationid;
        vm.pageHeader = {
            title: 'Room is : ' + vm.locationid,
            strapline: 'StrapLine is ' +vm.locationid
        }
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
                        if(element.image_url){
                            element.instagram = element.image_url+'media/?size=m';
                            element.containsInstagram = true;
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
            console.log('locationStreamsById');
            $timeout(loadTweetsDelay(), 0);
            //window.onload();
            
        })
        .error(function(e){
            console.log(e);
        });
        
        $scope.loadNewStreams= function(){
            var limit = vm.newTweetsCount;
            vm.newTweetsCount = 0;
            locationsData.locationNewStreamsById(vm.locationid, limit, 0)
            .success(function(data){
                data.forEach(function(element, index){
                    element.date = new Date(element.date);
                    element.containsInstagram = false;
                    if(element.image_url){
                            element.instagram = element.image_url+'media/?size=m';
                            element.containsInstagram = true;
                        }
                    streams.push(element);
                });
                vm.data = { tweets: streams };
                vm.totalStreamsLoaded = vm.data.tweets.length;
                console.log('loadNewStreams');
                $timeout(loadTweetsDelay(), 0);
            })
            .error(function(e){
                console.log(e);
            });
        }
        
        //TODO: Need to figure out the twitter load problem with angular
        /*$document.ready(function() {
            console.log('$document.ready');
            loadTweetsDelay();
        });*/
        
        
        $scope.$on("$destroy", function(){
            socket.emit('leave');
        });
        
        $scope.loadOlderStreams = function(){
            var limit = 20;
            var skip = vm.newTweetsCount + vm.totalStreamsLoaded;
            console.log(skip);
            locationsData.locationNewStreamsById(vm.locationid, limit, skip)
            .success(function(data){
                data.forEach(function(element, index){
                    element.date = new Date(element.date);
                    element.containsInstagram = false;
                    if(element.image_url){
                            element.instagram = element.image_url+'media/?size=m';
                            element.containsInstagram = true;
                        }
                    streams.push(element);
                });
                vm.data = { tweets: streams };
                vm.totalStreamsLoaded = vm.data.tweets.length;
                loadTweetsDelay();
            })
            .error(function(e){
                console.log(e);
            });
        }
    }
        
    
     function loadTweetsDelay(){
         //window.twttr.widgets.load();
        console.log('here')
         setTimeout(function(){
             window.twttr.ready(function(twttr){
                 console.log(twttr);
            twttr.widgets.load(
                document.getElementById("tweets-repeat")
);
                 });
                }, 1000);
     }
})();