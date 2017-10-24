var User = require('../services/user');

module.exports = Module;

function Module (req, res, next) {

  try {

    User.getByID(req.user._id).then(success, fail);

    function success (user) {
      req.data = { status: 200, result: user };
      return next();
    }

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 500, result: err };
    return next();
  }

}
