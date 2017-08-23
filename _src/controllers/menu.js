(function () {
    'use strict';

    angular
    .module('app')
    .controller('MenuController', Controller);

    function Controller ($scope, $rootScope, $state, $window, $http, $localStorage, User) {
        var menu = this;

        menu.user = {};
        menu.expandHamburger = expandHamburger;
        menu.logout = logout;

        initController();

        function initController () {

            $scope.$watch(function () {
                return User.user;
            }, function (newVal, oldVal) {
                if (typeof newVal !== 'undefined') menu.user = newVal;
            });

            $scope.$watch(function () {
                return $rootScope.hamburger;
            }, function (newVal, oldVal) {
                if (typeof newVal !== 'undefined') menu.hamburger = $rootScope.hamburger;
            });

        }

        function expandHamburger () {
            $rootScope.hamburger = $rootScope.hamburger ? false : true;
        }

        function logout () {

            User.Logout();
            User.setUser({});
            delete $window.jwtToken;
            delete $http.defaults.headers.common['Authorization'];
            delete $localStorage.token;
            $state.go('login');

        }

    }

})();