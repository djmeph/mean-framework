var User = require('../services/user');

module.exports = function (req, res, next) {

  try {

    User.post(req.body).then(success, fail);

    function success (result) {
      req.session.token = result.token;
      req.data = { err: false, username: result.user.display }
      return next();
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