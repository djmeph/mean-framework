var Link = require('../services/link');

module.exports = function (req, res, next) {

  try {

    Link.post(req.user._id, req.body.url).then(success, fail);

    function success (link) {
      req.data = { err: false };
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