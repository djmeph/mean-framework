var Q = require('q');
var nodemailer = require('nodemailer');
var service = {};

service.send = send;

module.exports = service;

function send (text, email, subject, GMAIL_ADDRESS, GMAIL_PASSWORD, NOREPLY_EMAIL) {

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

  } catch (err) { deferred.reject(err); }

  return deferred.promise;

}
