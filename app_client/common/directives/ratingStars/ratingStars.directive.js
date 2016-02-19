(function(){
    angular
        .module('seattweetApp')
        .directive('ratingStars', ratingStars);

    //In this instance the E and the A stand for element and attribute, respectively, 
    //so rating-stars can be its own element or an attribute of another element.
    //angular converts camelCase to camel-case => hence the rating-stars from ratingStars
    function ratingStars (){
        return {
            restrict: 'EA',
            scope : {
                thisRating : '=rating'
            },
            templateUrl: '/common/directives/ratingStars/ratingStars.template.html' 
        };
    }
})();