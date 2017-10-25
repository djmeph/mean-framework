var User = require('../services/user');
var Email = require('../services/email');

module.exports = Module;

function Module (req, res, next) {
  const APP_NAME = req.app.get('APP_NAME');
  const GMAIL_ADDRESS = req.app.get('GMAIL_ADDRESS');
  const GMAIL_PASSWORD = req.app.get('GMAIL_PASSWORD');
  const NOREPLY_EMAIL = req.app.get('NOREPLY_EMAIL');

  try {

    User.getRecover(req.params.email).then(successRecover, fail);

    function successRecover (result) {

      var protocol = req.connection.encrypted ? "https://" : "http://";
      var text = 'Password Recovery.\n\n';
      text += 'Click this link to reset your password:\n\n';
      text += protocol + req.headers.host + '/#!/reset-password/' + encodeURIComponent(result.email) + "/" + result.code;
      var subject = APP_NAME + ' - Password Recovery';

      Email.send(text, result.email, subject, GMAIL_ADDRESS, GMAIL_PASSWORD, NOREPLY_EMAIL).then(successSend, fail);

      function successSend () {
        req.data = { status: 200, result: "Recovery email sent" };
        return next();
      }

    }

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 500, result: err };
    return next();
  }

}
