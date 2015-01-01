'use strict';

// via http://stackoverflow.com/questions/25581560/dynamic-syntax-highlighting-with-angularjs-and-highlight-js

angular.module('googleWebfontsHelperApp')
  .directive('highlightjs', function ($interpolate, $window) {
    return {
      restrict: 'EA',
      scope: true,
      compile: function (tElem, tAttrs) {
          var interpolateFn = $interpolate(tElem.html(), true);
          tElem.html(''); // disable automatic intepolation bindings
                        
          return function(scope, elem, attrs){
            scope.$watch(interpolateFn, function (value) {
              elem.html(hljs.highlightAuto(value).value);
            });
          }
        }
    };
  });