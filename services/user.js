if (process.env.NODE_ENV == 'dev') var config = require('../config.json'); else var config = {};

const SECRET = process.env.NODE_ENV == 'dev' ? config.SECRET : process.env.SECRET;
const SALT_WORK_FACTOR = normalize(process.env.NODE_ENV == 'dev' ? config.SALT_WORK_FACTOR : process.env.SALT_WORK_FACTOR);

var User = require('../models/user');
var Q = require('q');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var service = {};

service.post = post;
service.getByID = getByID;
service.auth = auth;
service.put = put;
service.setPassword = setPassword;
service.getRecover = getRecover;
service.reset = reset;

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
        else deferred.resolve({ token: jwt.sign({ _id: doc._id }, SECRET), user: doc });
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
      else if (user) deferred.resolve({ token: jwt.sign({ _id: user._id }, SECRET), user: user });
      else deferred.reject({ message: "User not found" });
    });

  } catch (err) {
      if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
      deferred.reject(err.message);
  }

  return deferred.promise;

}

function put (_id, data) {

  var deferred = Q.defer();

  try {

    var payload = data;
    payload.display = data.username;
    payload.username = data.username.toLowerCase();

    User.update(
      { _id: _id },
      { $set: payload },
      function (err) {
        if (err) deferred.reject(err);
        else deferred.resolve(payload);
      }
    );

  } catch (err) {
      if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
      deferred.reject(err.message);
  }

  return deferred.promise;

}

function setPassword (_id, password) {

  var deferred = Q.defer();

  try {

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      bcrypt.hash(password, salt, null, function (err, hash) {
        User.update(
          { _id: _id },
          { $set: { password: hash } },
          function (err) {
            if (err) deferred.reject(err);
            else deferred.resolve();
          }
        );
      });
    });

  } catch (err) {
      if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
      deferred.reject(err.message);
  }

  return deferred.promise;

}

function getRecover (email) {

  var deferred = Q.defer();

  try {

    var code = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });

    User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { recover: code } },
      function (err, user) {
        if (err || user === null) deferred.reject();
        else deferred.resolve({ email: user.email, code: code });
      }
    );

  } catch (err) {
      if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
      deferred.reject(err.message);
  }

  return deferred.promise;

}

function reset (email, code, password) {

    var deferred = Q.defer();

    try {

        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            bcrypt.hash(password, salt, null, function (err, hash) {
                User.findOneAndUpdate(
                    { email: email, recover: code },
                    { $set: { password: hash } },
                    function (err, doc) {
                        if (err) deferred.reject(err);
                        else if (doc === null) deferred.reject({ message: 'Invalid credentials' });
                        else deferred.resolve();
                    }
                );
            });
        });

    } catch (err) {
        if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
        deferred.reject(err.message);
    }

    return deferred.promise;

}

// Private functions 
function normalize (val) {
  var payload = parseInt(val, 10);
  if (isNaN(payload)) return val;
  if (payload >= 0) return payload;
  return false;
}