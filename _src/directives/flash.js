(function () {
  'use strict';

  angular
    .module('app')
    .directive('flash', Directive);

    function Directive () {
 
      var directive = {
        restrict: 'E',
        templateUrl: 'views/flash.html'
      };
      return directive;

    }

})();