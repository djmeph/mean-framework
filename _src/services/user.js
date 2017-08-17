(function () {
    'use strict';

    angular
    .module('app')
    .factory('User', Service);

    function Service ($http, $q, $rootScope, $location) {

        var service = {};
        var domain = $rootScope.globals.domain;

        service.Create = Create;
        service.AuthCheck = AuthCheck;
        service.GetCurrent = GetCurrent;
        service.Authenticate = Authenticate;

        return service;

        function Create (data) {
            return $http.post(domain + '/api/user', data).then(handleSuccess, handleError);
        }

        function AuthCheck () {
            if ($http.defaults.headers.common['Authorization']) return $http.get(domain + '/api/user?' + $.param({ _: moment().unix() })).then(handleSuccess, handleError);
            else return $q.reject();
        }

        function GetCurrent () {
            return $http.get(domain + '/api/user?' + $.param({ _: moment().unix() })).then(handleSuccess, handleError);
        }

        function Authenticate (credentials) {
            return $http.post(domain + '/api/auth', credentials).then(handleSuccess, handleError);
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