(function () {
  'use strict';

  angular
  .module('app')
  .controller('Home.IndexController', Controller);

  function Controller($state, $location, User, Link) {
    var vm = this;
    var prefix = null;

    vm.url = null;
    vm.links = [];

    vm.submit = submit;

    initController();

    function initController () {

      getPrefix();

      User.AuthCheck().then(successAuth, failAuth);

      function successAuth (result) {
        Link.GetLinks().then(successLinks, fail);
      }

      function failAuth (err) {
        $state.go('login');
      }

      function getPrefix () {
        var host = $location.host();
        var protocol = $location.protocol();
        var port = $location.port();
        var prefix = protocol + "://" + host;
        if (protocol == 'http' && port != 80 || protocol == 'https' && port != 443) prefix += ":" + port;
        prefix += "/";
        vm.prefix = prefix;
      }

    }

    function submit () {
      Link.Post(vm.url).then(successPost, fail);
    }

    function successPost () {
      vm.url = null;
      Link.GetLinks().then(successLinks, fail);
    }

    function successLinks (links) {
      vm.links = links;
    }

    function fail (err) {
      Link.GetLinks().then(successLinks, fail);
    }

  }

})();