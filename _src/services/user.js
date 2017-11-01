(function () {
  'use strict';

  angular
  .module('app')
  .factory('User', Service);

  function Service ($http, $q, $rootScope, $location, $localStorage, $state) {

    var service = {};

    service.Create = Create;
    service.GetCurrent = GetCurrent;
    service.Authenticate = Authenticate;
    service.CheckAuth = CheckAuth;
    service.Logout = Logout;
    service.Put = Put;
    service.ChangePassword = ChangePassword;
    service.GetRecover = GetRecover;
    service.Reset = Reset;

    return service;

    function Create (data) {
      return $http.post('/api/register', data).then(successAuthCheck, handleError);
    }

    function GetCurrent () {
      if ($http.defaults.headers.common['Authorization']) return $http.get('/api/user?' + $.param({ _: moment().unix() })).then(successUser, handleError);
      else return $q.reject();
    }

    function Authenticate (credentials) {
      return $http.post('/api/auth', credentials).then(successAuthCheck, handleError);
    }

    function CheckAuth () {
      return $http.get('/api/token?' + $.param({ _: moment().unix() })).then(successAuthCheck, handleError);
    }

    function Logout () {
      return $http.delete('/api/token');
    }

    function Put (data) {
      return $http.put('/api/user', data).then(handleSuccess, handleError);
    }

    function ChangePassword (oldp, newp) {
      return $http.put('/api/password', { old: oldp, new: newp }).then(handleSuccess, handleError);
    }

    function GetRecover (email) {
      return $http.get('/api/recover/' + encodeURIComponent(email) + '?' + $.param({ _: moment().unix() })).then(handleSuccess, handleError);
    }

    function Reset (data) {
      return $http.post('/api/reset', data).then(handleSuccess, handleError);
    }

    // private functions

    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }

    function successUser (res) {
      $rootScope.user = res.data;
      return res.data;
    }

    function successAuthCheck (res) {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
      if (res.data.user) $rootScope.user = res.data.user;
      else if (!$rootScope.user) GetCurrentNoPromise();
      return res.data;
    }

    function GetCurrentNoPromise () {
      $http.get('/api/user?' + $.param({ _: moment().unix() })).then(success, fail);

      function success (res) {
        $rootScope.user = res.data;
      }

      function fail (res) {
        delete $http.defaults.headers.common['Authorization'];
        delete $localStorage.token;
        $state.go('login');
      }
    }

  }

})();
