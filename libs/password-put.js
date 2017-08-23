var User = require('../services/user');

module.exports = function (req, res, next) {

  try {

    User.getByID(req.user._id).then(successUser, fail);

    function successUser (user) {

      User.auth(user.username, req.body.old).then(authenticated, fail);

      function authenticated () {

        User.setPassword(user._id, req.body.new).then(successPassword, fail);

        function successPassword () {
          req.data = { err: false, msg: 'Password successfully changed' }
          console.log(req.data)
          return next();
        }

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