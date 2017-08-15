(function () {
    'use strict';

    angular
    .module('app')
    .controller('Signup.IndexController', Controller);

    function Controller($window, $http, $state, User) {
        var vm = this;

        vm.username = null;
        vm.email = null;
        vm.password = null;
        vm.verify = false;
        vm.flash = {};
        vm.regex = /^[a-zA-Z0-9_]+$/;

        vm.save = save;

        function save () {
            User.Create({
                username: vm.username,
                email: vm.email,
                password: vm.password
            }).then(success, fail);

            function success (res) {
                $window.jwtToken = res.token;
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
                //$state.go("account-new");
                console.log(res);
            }

            function fail (res) {
                console.log(res)
                vm.flash = { error: { msg: res } };
            }
        }

    }

})();