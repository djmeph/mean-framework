(function () {
  'use strict';

  angular
  .module('app')
  .controller('UserSettings.IndexController', Controller);

  function Controller($state, $rootScope, User) {
    var vm = this;

    vm.username = null;
    vm.email = null;
    vm.flash = {};
    vm.regex = /^[a-zA-Z0-9_]+$/;

    vm.save = save;

    // Initialize Controller

    initController();

    function initController () {
      User.CheckAuth().then(successAuth, fail);
    }

    // Controller functions

    function save () {
      User.Put({
        username: vm.username,
        email: vm.email
      }).then(successSave, failSave);

      function successSave (result) {
        vm.flash = { success: { msg: "Saved @" + moment().format('hh:mm:ss a') } };
        $rootScope.user.display = vm.username;
      }

      function failSave (err) {
        vm.flash = { error: { msg: err.message } };
      }
    }

    // Private Function

    function successAuth (result) {
      User.GetCurrent().then(successUser, fail);

      function successUser (result) {
        vm.username = result.display;
        vm.email = result.email;
      }
    }

    function fail (err) {
      $state.go('login');
    }

  }

})();
