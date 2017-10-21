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
    service.setUsername = setUsername;

    service.Create = Create;
    service.GetCurrent = GetCurrent;
    service.Authenticate = Authenticate;
    service.Logout = Logout;
    service.Put = Put;
    service.ChangePassword = ChangePassword;
    service.GetRecover = GetRecover;
    service.Reset = Reset;

    return service;

    function setUser (user) {
      service.user = user;
    }

    function setUsername (username) {
      service.user.display = username;
    }

    function Create (data) {
      return $http.post(domain + '/api/register', data).then(successAuthCheck, handleError);
    }

    function GetCurrent () {
      if ($http.defaults.headers.common['Authorization']) return $http.get(domain + '/api/user?' + $.param({ _: moment().unix() })).then(successUser, handleError);
      else return $q.reject();
    }

    function Authenticate (credentials) {
      return $http.post(domain + '/api/auth', credentials).then(successAuthCheck, handleError);
    }

    function Logout () {
      return $http.delete(domain + '/api/token');
    }

    function Put (data) {
      return $http.put(domain + '/api/user', data).then(handleSuccess, handleError);
    }

    function ChangePassword (oldp, newp) {
      return $http.put(domain + '/api/password', { old: oldp, new: newp }).then(handleSuccess, handleError);
    }

    function GetRecover (email) {
      return $http.get(domain + '/api/recover/' + encodeURIComponent(email) + '?' + $.param({ _: moment().unix() })).then(handleSuccess, handleError);
    }

    function Reset (data) {
      return $http.post(domain + '/api/reset', data).then(handleSuccess, handleError);
    }

    // private functions

    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }

    function successUser (res) {
      setUser(res.data);
      return res.data;
    }

    function successAuthCheck (res) {
      setUser(res.data.user);
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
      return res.data;
    }

  }

})();
