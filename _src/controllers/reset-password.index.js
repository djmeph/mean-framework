(function () {
    'use strict';

    angular
        .module('app')
        .controller('ResetPassword.IndexController', Controller);

    function Controller($state, $scope, $rootScope, $stateParams, User) {
        var vm = this;

        vm.flash = {};
        vm.password = null;
        vm.verify = null;
        vm.email = $stateParams.email;
        vm.code = $stateParams.code;

        vm.reset = reset;

        function reset () {

            var payload = { email: vm.email, code: vm.code, password: vm.password };

            User.Reset(payload).then(success, fail);

            vm.password = null;
            vm.verify = null;

            function success () {
                $state.go('login');
            }

            function fail (res) {
                vm.flash = { error: { msg: res } };
            }

        }

    }

})();