(function () {
  'use strict';

  angular
  .module('app')
  .controller('ResetPassword.IndexController', Controller);

  function Controller($state, $stateParams, User) {
    var vm = this;

    // Controller variables

    vm.flash = {};
    vm.password = null;
    vm.verify = null;
    vm.email = $stateParams.email;
    vm.code = $stateParams.code;

    vm.reset = reset;

    // Controller functions

    function reset () {

      var payload = { email: vm.email, code: vm.code, password: vm.password };

      User.Reset(payload).then(success, fail);

      vm.password = null;
      vm.verify = null;

    }

    // Private Functions

    function success () {
      $state.go('login');
    }

    function fail (err) {
      vm.flash = { error: { msg: err.message } };
    }

  }

})();
