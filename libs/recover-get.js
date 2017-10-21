if (process.env.NODE_ENV == 'dev') var config = require('../config.json'); else var config = {};

const APP_NAME = process.env.NODE_ENV == 'dev' ? config.APP_NAME : process.env.APP_NAME;

var User = require('../services/user');
var Email = require('../services/email');

module.exports = Module;

function Module (req, res, next) {

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
        req.data = { status: 200, result: "Recovery email sent" };
        return next();
      }

    }

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 400, result: err.message };
    return next();
  }

}
