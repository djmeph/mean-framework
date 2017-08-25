var User = require('../services/user');

module.exports = function (req, res, next) {

  try {

    User.reset(req.body.email, req.body.code, req.body.password).then(success, fail);

    function success (result) {
      req.data = { err: false, msg: "Recovery email sent" };
      return next();
    }

    function fail (err) {
      req.data = { err: false, msg: err.message };
      return next();
    }

  } catch (err) {
    if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err)
    req.data = { err: true, msg: err.message };
    return next();
  }

};