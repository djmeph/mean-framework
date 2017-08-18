(function () {
    'use strict';

    angular
    .module('app')
    .factory('Link', Service);

    function Service ($http, $q, $rootScope, $location) {

        var service = {};
        var domain = $rootScope.globals.domain;

        service.GetLinks = GetLinks;
        service.Post = Post;

        return service;

        function GetLinks (data) {
            return $http.get(domain + '/api/links', data).then(handleSuccess, handleError);
        }

        function Post (url) {
            return $http.post(domain + '/api/link', { url: url }).then(handleSuccess, handleError);
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