var User = require('../services/user');

module.exports = Module;

function Module (req, res, next) {

  try {

    User.put(req.user._id, req.body).then(success, fail);

    function success () {
      req.data = { status: 200 };
      return next();
    }

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 500, result: err };
    return next();
  }

}
