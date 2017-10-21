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

      User.GetCurrent().then(successAuth, failAuth);

      function successAuth (result) {
        vm.message = 'Hello ' + result.display + '!';
      }

      function failAuth (err) {
        $state.go('login');
      }

    }

  }

})();
