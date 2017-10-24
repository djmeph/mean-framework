var User = require('../services/user');

module.exports = Module;

function Module (req, res, next) {
  const SECRET = req.app.get('SECRET');

  try {

    User.auth(req.body.username, req.body.password, SECRET).then(success, fail);

    function success (result) {
      req.session.token = result.token;
      req.data = { status: 200, result: { token: result.token, user: result.user } };
      return next();
    }

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 500, result: err };
    return next();
  }

}
