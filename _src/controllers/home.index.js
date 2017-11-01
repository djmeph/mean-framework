(function () {
  'use strict';

  angular
  .module('app')
  .controller('Home.IndexController', Controller);

  function Controller($state, User) {
    var vm = this;

    vm.message = null;

    initController();

    function initController () {

      User.CheckAuth().then(successAuth, failAuth);

      function successAuth (result) {
        vm.message = 'Hello World!';
      }

      function failAuth (err) {
        $state.go('login');
      }

    }

  }

})();
