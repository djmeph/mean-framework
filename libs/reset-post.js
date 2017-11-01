var User = require('../services/user');

module.exports = Module;

function Module (req, res, next) {

  try {

    User.reset(req.body.email, req.body.code, req.body.password).then(success, fail);

    function success (result) {
      req.data = { status: 200, result: "Recovery email sent" };
      return next();
    }

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 500, result: err };
    return next();
  }

}
