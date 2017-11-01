(function () {
  'use strict';

  angular
  .module('app')
  .controller('RecoverPassword.IndexController', Controller);

  function Controller(User) {
    var vm = this;

    // Controller variables

    vm.flash = {};
    vm.email = null;

    vm.getRecover = getRecover;

    // Controller functions

    function getRecover () {
      User.GetRecover(vm.email).then(success, fail);
      vm.email = null;
    }

    // Private Functions

    function success () {
      vm.flash = { success: { msg: "Recovery email sent" } };
    }

    function fail (err) {
      vm.flash = { error: { msg: err.message } };
    }

  }

})();
