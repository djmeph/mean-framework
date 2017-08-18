(function () {
    'use strict';

    angular
    .module('app')
    .factory('User', Service);

    function Service ($http, $q, $rootScope, $location) {

        var service = {};
        var domain = $rootScope.globals.domain;

        service.user = {};
        service.setUser = setUser;

        service.Create = Create;
        service.AuthCheck = AuthCheck;
        service.GetCurrent = GetCurrent;
        service.Authenticate = Authenticate;
        service.Logout = Logout;

        return service;

        function Create (data) {
            return $http.post(domain + '/api/register', data).then(handleSuccess, handleError);
        }

        function AuthCheck () {
            if ($http.defaults.headers.common['Authorization']) return $http.get(domain + '/api/user?' + $.param({ _: moment().unix() })).then(successAuthCheck, handleError);
            else return $q.reject();
        }

        function GetCurrent () {
            return $http.get(domain + '/api/user?' + $.param({ _: moment().unix() })).then(successAuthCheck, handleError);
        }

        function Authenticate (credentials) {
            return $http.post(domain + '/api/auth', credentials).then(handleSuccess, handleError);
        }

        function Logout () {
            return $http.delete(domain + '/api/token');
        }

        function setUser (user) {
            service.user = user;
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }

        function successAuthCheck (user) {
            setUser(user.data);
            return user.data;
        }

    }

})();