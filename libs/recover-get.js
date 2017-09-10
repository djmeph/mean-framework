if (process.env.NODE_ENV == 'dev') var config = require('../config.json'); else var config = {};

const APP_NAME = process.env.NODE_ENV == 'dev' ? config.APP_NAME : process.env.APP_NAME;

var User = require('../services/user');
var Email = require('../services/email');

module.exports = function (req, res, next) {

  try {

    User.getRecover(req.params.email).then(successRecover, fail);

    function successRecover (result) {

      var protocol = req.connection.encrypted ? "https://" : "http://";
      var text = 'Password Recovery.\n\n';
      text += 'Click this link to reset your password:\n\n';
      text += protocol + req.headers.host + '/dashboard/#!/reset-password/' + encodeURIComponent(result.email) + "/" + result.code;
      var subject = APP_NAME + ' - Password Recovery';

      Email.send(text, result.email, subject).then(successSend, fail);

      function successSend () {
        req.data = { err: false, msg: "Recovery email sent" };
        return next();
      }

    }

    function fail (err) {
      req.data = { err: true, msg: err.message };
      return next();
    }

  } catch (err) {
    if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err)
    req.data = { err: true, msg: err.message };
    return next();
  }

};