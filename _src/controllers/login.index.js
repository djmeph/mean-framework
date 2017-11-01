(function () {
  'use strict';

  angular
  .module('app')
  .controller('Login.IndexController', Controller);

  function Controller($state, $localStorage, User) {
    var vm = this;

    // Controller variables

    vm.flash = {};
    vm.username = null;
    vm.password = null;
    vm.remember = false;
    vm.redirect = null;

    vm.checkLogin = checkLogin;

    // Controller functions

    function checkLogin () {
      User.Authenticate({ username: vm.username, password: vm.password, remember: vm.remember }).then(success, fail);
    }

    // Private Functions

    function success (res) {
      vm.flash = {};
      if (vm.remember) $localStorage.token = res.token;
      $state.go("home");
    }

    function fail (err) {
      vm.flash.error = { msg: err.message };
    }

  }

})();
