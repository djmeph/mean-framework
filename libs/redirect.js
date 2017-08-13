var Link = require('../services/link');

module.exports = function (req, res, next) {

  try {

    Link.get(req.params.slug.toLowerCase()).then(success, fail);

    function success (url) {
      req.data = { url: url };
      return next();
    }

    function fail () {
      req.data = { err: true, msg: "link not found" };
      return next();
    }

  } catch (err) {
    if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err)
    req.data = { err: true, msg: err.message };
    return next();
  }

};