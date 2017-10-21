var Link = require('../services/link');
var Hit = require('../services/hit');

module.exports = Module;

function Module (req, res, next) {

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

      req.data = { status: 200, url: result.url };
      return next();

    }

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 400, result: err.message };
    return next();
  }

}
