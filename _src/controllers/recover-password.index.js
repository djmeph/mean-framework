(function () {
    'use strict';

    angular
        .module('app')
        .controller('RecoverPassword.IndexController', Controller);

    function Controller(User) {
        var vm = this;

        vm.flash = {};
        vm.email = null;

        vm.getRecover = getRecover;

        function getRecover () {

            User.GetRecover(vm.email).then(success, fail);

            vm.email = null;

            function success () {

                vm.flash = { success: { msg: "Recovery email sent" } };

            }

            function fail (res) {

                vm.flash = { error: { msg: res } };

            }

        }

    }

})();