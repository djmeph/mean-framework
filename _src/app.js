(function () {

  'use strict';

  angular
  .module('app', ['ui.router', 'ngStorage'])
  .config(config)
  .run(run);

  function config ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html',
      data: { activeTab: 'home' },
      controller: 'Home.IndexController as vm'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'views/signup.html',
      data: { activeTab: 'signup' },
      controller: 'Signup.IndexController as vm'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      data: { activeTab: 'login' },
      controller: 'Login.IndexController as vm'
    })
    .state('user-settings', {
      url: '/user-settings',
      templateUrl: 'views/user-settings.html',
      data: { activeTab: 'user-settings' },
      controller: 'UserSettings.IndexController as vm'
    })
    .state('change-password', {
      url: '/change-password',
      templateUrl: 'views/change-password.html',
      data: { activeTab: 'change-password' },
      controller: 'ChangePassword.IndexController as vm'
    })
    .state('recover-password', {
      url: '/recover-password',
      templateUrl: 'views/recover-password.html',
      data: { activeTab: 'recover-password' },
      controller: 'RecoverPassword.IndexController as vm'
    })
    .state('reset-password', {
      url: '/reset-password/:email/:code',
      templateUrl: 'views/reset-password.html',
      data: { activeTab: 'reset-password' },
      controller: 'ResetPassword.IndexController as vm'
    });

  }

  function run ($http, $rootScope, $transitions, $localStorage) {

    if ($localStorage.token) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.token;

    $transitions.onStart({}, function (transition) {
      $rootScope.hamburger = false;
    });

    $transitions.onSuccess({}, function (transition) {
      var toData = transition.$to();
      $rootScope.activeTab = toData.data.activeTab;
    });

  }

  $(function () {

    angular.bootstrap(document, ['app']);

  });

})();
