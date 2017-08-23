var User = require('../services/user');

module.exports = function (req, res, next) {

  try {

    User.put(req.user._id, req.body).then(success, fail);

    function success (result) {
      req.data = { err: false, result: result }
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