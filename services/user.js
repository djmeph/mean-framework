var User = require('../models/user');
var Q = require('q');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var config = require('../config.json');
var service = {};

service.post = post;
service.getByID = getByID;
service.auth = auth;

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
        else deferred.resolve({ token: jwt.sign({ _id: doc._id }, config.secret), user: doc });
      });

    }

  } catch (err) {
    if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
    deferred.reject(err.message);
  }

  return deferred.promise;

}

function getByID (_id) {

    var deferred = Q.defer();

    try {

        User
        .findOne({ _id: _id })
        .select('-password')
        .exec(function (err, user) {

            if (err) deferred.reject(err);
            else if (user) deferred.resolve(user);
            else deferred.reject();

        });

    } catch (err) {
        if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
        deferred.reject(err.message);
    }

    return deferred.promise;

}

function auth (username, password) {

  var deferred = Q.defer();

  try {

    User
    .getAuthenticated(username.toLowerCase(), password, function (err, user, reason) {
      if (err) deferred.reject(err);
      else if (user) deferred.resolve({ token: jwt.sign({ _id: user._id }, config.secret), user: user });
      else deferred.reject({ message: "User not found" });
    });

  } catch (err) {
      if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
      deferred.reject(err.message);
  }

  return deferred.promise;

}
