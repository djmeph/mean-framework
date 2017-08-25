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
    });

  }

  function run ($http, $rootScope, $window) {

    $rootScope.globals = $window.globals;

    if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      $rootScope.hamburger = false;
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $rootScope.activeTab = toState.data.activeTab;
    });

  }

  $(function () {

    if (window.localStorage.getItem('ngStorage-token')) {

      window.jwtToken = JSON.parse(window.localStorage.getItem('ngStorage-token'));

      $.ajaxSetup({ headers: { 'x-access-token': window.jwtToken } });

    }

    $.get(window.globals.domain + '/api/token').then(success, fail);

    function success (token) {

      window.jwtToken = token;

      angular.bootstrap(document, ['app']);

    }

    function fail () {

      angular.bootstrap(document, ['app']);

    }

  });

})();