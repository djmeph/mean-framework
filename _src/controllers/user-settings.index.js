(function () {
    'use strict';

    angular
    .module('app')
    .controller('UserSettings.IndexController', Controller);

    function Controller($state, User) {
        var vm = this;

        vm.username = null;
        vm.email = null;
        vm.flash = {};
        vm.regex = /^[a-zA-Z0-9_]+$/;

        vm.save = save;

        initController();

        function initController () {
            User.AuthCheck().then(successAuth, failAuth);
        }

        function save () {
            User.Put({
                username: vm.username,
                email: vm.email
            }).then(successSave, failSave);

            function successSave (result) {
                vm.flash = { success: { msg: "Saved @" + moment().format('hh:mm:ss a') } };
                vm.username = result.display;
                vm.email = result.email;
                User.setUsername(result.display);
            }

            function failSave (err) {
                vm.flash = { error: { msg: err } };
                User.AuthCheck().then(successAuth, failAuth);
            }
        }

        function successAuth (result) {
            vm.username = result.display;
            vm.email = result.email;
        }

        function failAuth (err) {
            $state.go('login');
        }        

    }

})();