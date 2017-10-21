(function () {
  'use strict';

  angular
  .module('app')
  .directive('userMenu', Directive);

  function Directive () {

    var directive = {
      restrict: 'E',
      templateUrl: 'views/menu.html'
    };
    return directive;

  }

})();
