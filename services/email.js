var Q = require('q');
var nodemailer = require('nodemailer');
var config = require('../config.json');
var service = {};

service.send = send;

module.exports = service;

function send (text, email, subject) {

  var deferred = Q.defer();

  try {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: config.gmail.address,
          pass: config.gmail.password
      }
    });

    var payload = {
      from: config.noreply_email,
      to: email,
      subject: subject,
      text: text
    };

    transporter.sendMail(payload, function (err, info) {
      if (err) deferred.reject(err);
      else deferred.resolve();
    });

  } catch (err) {
    if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
    deferred.reject(err.message);
  }

  return deferred.promise;

}