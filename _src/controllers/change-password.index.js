(function () {
  'use strict';

  angular
  .module('app')
  .controller('ChangePassword.IndexController', Controller);

  function Controller($state, User) {
    var vm = this;

    // Controller variables

    vm.password = null;
    vm.new = null;
    vm.verify = null;
    vm.flash = {};

    vm.save = save;

    // Initialize Controller

    initController();

    function initController () {
      User.CheckAuth().then(successAuth, failAuth);
    }

    // Controller functions

    function save () {
      User.ChangePassword(vm.password, vm.new).then(successPassword, failPassword);

      function successPassword () {
        vm.password = null;
        vm.new = null;
        vm.verify = null;
        vm.flash = { success: { msg: "Saved @" + moment().format('hh:mm:ss a') } };
      }

      function failPassword (err) {
        vm.password = null;
        vm.new = null;
        vm.verify = null;
        vm.flash = { error: { msg: err.message } };
      }
    }

    // Private Functions

    function successAuth (result) {}

    function failAuth (err) {
      $state.go('login');
    }

  }

})();
