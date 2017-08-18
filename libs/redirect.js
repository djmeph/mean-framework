var Link = require('../services/link');
var Hit = require('../services/hit');

module.exports = function (req, res, next) {

  try {

    Link.get(req.params.slug.toLowerCase()).then(success, fail);

    function success (result) {

      var referrer = req.header('Referer');

      Hit.post({
        address: req.connection.remoteAddress,
        useragent: req.headers['user-agent'],
        "Link": result._id,
        referrer: referrer
      });

      req.data = { url: result.url };
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