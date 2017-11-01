(function () {
  'use strict';

  angular
  .module('app')
  .controller('Home.IndexController', Controller);

  function Controller($state, User) {
    var vm = this;

    // Controller variables

    vm.message = null;

    // Initialize Controller

    initController();

    function initController () {
      User.CheckAuth().then(successAuth, failAuth);
    }

    // Private Functions

    function successAuth (result) {
      vm.message = 'Hello World!';
    }

    function failAuth (err) {
      $state.go('login');
    }

  }

})();
