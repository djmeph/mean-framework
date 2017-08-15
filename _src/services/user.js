(function () {
    'use strict';

    angular
    .module('app')
    .factory('User', Service);

    function Service ($http, $q, $rootScope, $location) {

        var service = {};
        var domain = $rootScope.globals.domain;

        service.Create = Create;

        return service;

        function Create (data) {
            return $http.post(domain + '/api/user', data).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }

    }

})();