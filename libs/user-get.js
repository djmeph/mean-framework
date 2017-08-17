var User = require('../services/user');
var config = require('../config.json');

module.exports = function (req, res, next) {

  try {

    User.getByID(req.user._id).then(success, fail);

    function success (user) {
      req.data = { err: false, result: user };
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