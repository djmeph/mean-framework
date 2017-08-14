(function () {

  'use strict';

  angular
    .module('app', ['ui.router'])
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
    });

  }

  function run ($http, $rootScope, $window) {

    $rootScope.globals = $window.globals;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      $rootScope.hamburger = false;
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $rootScope.activeTab = toState.data.activeTab;
    });

  }

  $(function () {

    angular.bootstrap(document, ['app']);

  });

})();