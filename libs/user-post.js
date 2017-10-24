var User = require('../services/user');

module.exports = Module;

function Module (req, res, next) {
  const SECRET = req.app.get('SECRET');

  try {

    User.post(req.body, SECRET).then(success, fail);

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
    req.data = { status: 400, result: err.message };
    return next();
  }

}
