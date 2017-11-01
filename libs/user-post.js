var User = require('../services/user');

module.exports = Module;

function Module (req, res, next) {

  try {

    User.post(req.body).then(success, fail);

    function success (result) {
      req.session.token = result.token;
      var payload = result.user;
      delete payload.password;
      if (payload.recover) delete payload.recover;
      req.data = { status: 200, result: { user: payload, token: result.token } };
      return next();
    }

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 500, result: err };
    return next();
  }

}
