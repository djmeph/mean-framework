(function () {
  'use strict';

  angular
  .module('app')
  .controller('ChangePassword.IndexController', Controller);

  function Controller($state, User) {
    var vm = this;

    vm.password = null;
    vm.new = null;
    vm.verify = null;
    vm.flash = {};

    vm.save = save;

    initController();

    function initController () {
      User.GetCurrent().then(successAuth, failAuth);
    }

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

    function successAuth (result) {}

    function failAuth (err) {
      $state.go('login');
    }

  }

})();
