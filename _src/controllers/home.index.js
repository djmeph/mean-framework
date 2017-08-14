(function () {
  'use strict';

  angular
  .module('app')
  .controller('Home.IndexController', Controller);

  function Controller() {
    var vm = this;

    vm.message = "Hello World!";
    
  }

})();