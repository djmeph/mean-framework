(function () {
  'use strict';

  angular
  .module('app')
  .controller('Home.IndexController', Controller);

  function Controller($state, User) {
    var vm = this;

    vm.message = "Hello World!";

    initController();

    function initController () {

      User.AuthCheck().then(success, fail);

      function success (result) {
        console.log({success:result});
      }

      function fail (err) {
        $state.go('login');
      }

    }
    
  }

})();