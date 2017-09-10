if (process.env.NODE_ENV == 'dev') var config = require('../config.json'); else var config = {};

const GMAIL_ADDRESS = process.env.NODE_ENV == 'dev' ? config.GMAIL_ADDRESS : process.env.GMAIL_ADDRESS;
const GMAIL_PASSWORD = process.env.NODE_ENV == 'dev' ? config.GMAIL_PASSWORD : process.env.GMAIL_PASSWORD;
const NOREPLY_EMAIL = process.env.NODE_ENV == 'dev' ? config.NOREPLY_EMAIL : process.env.NOREPLY_EMAIL;

var Q = require('q');
var nodemailer = require('nodemailer');
var service = {};

service.send = send;

module.exports = service;

function send (text, email, subject) {

  var deferred = Q.defer();

  try {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: GMAIL_ADDRESS,
          pass: GMAIL_PASSWORD
      }
    });

    var payload = {
      from: NOREPLY_EMAIL,
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