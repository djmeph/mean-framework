var User = require('../services/user');

module.exports = Module;

function Module (req, res, next) {

  try {

    User.getByID(req.user._id).then(successUser, fail);

    function successUser (user) {

      User.auth(user.username, req.body.old).then(authenticated, fail);

      function authenticated () {

        User.setPassword(user._id, req.body.new).then(successPassword, fail);

        function successPassword () {
          req.data = { status: 200, result: 'Password successfully changed' };
          return next();
        }

      }

    }

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 500, result: err };
    return next();
  }

}
