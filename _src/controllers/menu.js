(function () {
    'use strict';

    angular
    .module('app')
    .controller('MenuController', Controller);

    function Controller ($scope, $rootScope) {
        var menu = this;

        menu.expandHamburger = expandHamburger;

        initController();

        function initController () {

            $scope.$watch(function () {
                return $rootScope.hamburger;
            }, function (newVal, oldVal) {
                if (typeof newVal !== 'undefined') menu.hamburger = $rootScope.hamburger;
            });

        }

        function expandHamburger () {
            $rootScope.hamburger = $rootScope.hamburger ? false : true;
        }

    }

})();