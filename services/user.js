var User = require('../models/user');
var Q = require('q');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var config = require('../config.json');
var service = {};

service.post = post;

module.exports = service;

function post (data) {

  var deferred = Q.defer();

  try {

    User
    .findOne({ $or: [ { username: data.username.toLowerCase() }, { email: data.email.toLowerCase() } ] })
    .exec(function (err, user) {
      if (err) deferred.reject(err);

      else if (user) {

        var fields = [];
        if (user.username == data.username.toLowerCase()) fields.push("Username");
        if (user.email == data.email.toLowerCase()) fields.push("Email address");
        var msg = fields.join(" and ") + " already taken";

        deferred.reject({ message: msg });

      } 

      else createUser();

    });

    function createUser () {

      var payload = data;
      payload.display = data.username;
      payload.username = data.username.toLowerCase();

      var newUser = new User(payload);
      newUser.save(function (err, doc) {
        if (err) deferred.reject(err);
        deferred.resolve({ token: jwt.sign({ sub: doc._id }, config.secret), user: doc });
      });

    }

  } catch (err) {
    if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
    deferred.reject(err.message);
  }

  return deferred.promise;

}