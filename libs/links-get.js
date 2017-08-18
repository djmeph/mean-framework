var Link = require('../services/link');

module.exports = function (req, res, next) {

  try {

    Link.getLinks(req.user._id).then(success, fail);

    function success (links) {
      req.data = { err: false, result: links };
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