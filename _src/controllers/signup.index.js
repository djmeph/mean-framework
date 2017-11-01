(function () {
  'use strict';

  angular
  .module('app')
  .controller('Signup.IndexController', Controller);

  function Controller($window, $http, $state, User) {
    var vm = this;

    // Controller variables

    vm.username = null;
    vm.email = null;
    vm.password = null;
    vm.verify = null;
    vm.flash = {};
    vm.regex = /^[a-zA-Z0-9_]+$/;

    vm.save = save;

    // Controller functions

    function save () {
      User.Create({
        username: vm.username,
        email: vm.email,
        password: vm.password
      }).then(success, fail);
    }

    // Private Functions

    function success (res) {
      $state.go('home');
    }

    function fail (err) {
      vm.flash = { error: { msg: err.message } };
    }

  }

})();
