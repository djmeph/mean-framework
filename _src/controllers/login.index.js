(function () {
    'use strict';

    angular
        .module('app')
        .controller('Login.IndexController', Controller);

    function Controller($window, $http, $state, $localStorage, User) {
        var vm = this;

        vm.flash = {};
        vm.username = null;
        vm.password = null;
        vm.remember = false;
        vm.redirect = null;

        vm.checkLogin = checkLogin;

        function checkLogin () {

            User.Authenticate({ username: vm.username, password: vm.password }).then(success, fail);

            function success (res) {
                vm.flash = {};
                $window.jwtToken = res.token;
                if (vm.remember) $localStorage.token = $window.jwtToken;
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
                $state.go("home");
            }

            function fail (res) {
                vm.flash.error = { msg: res };
            }

        }

    }

})();