(function () {
  'use strict';

  angular
  .module('app')
  .controller('MenuController', Controller);

  function Controller ($scope, $rootScope, $state, $http, $localStorage, User) {
    var menu = this;

    menu.expandHamburger = expandHamburger;
    menu.logout = logout;

    function expandHamburger () {
      $rootScope.hamburger = $rootScope.hamburger ? false : true;
    }

    function logout () {

      User.Logout();
      $rootScope.user = {};
      delete $http.defaults.headers.common['Authorization'];
      delete $localStorage.token;
      $state.go('login');

    }

  }

})();
