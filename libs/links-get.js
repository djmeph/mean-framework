var Link = require('../services/link');

module.exports = function (req, res, next) {

  try {

    Link.getLinks(req.user._id).then(success, fail);

    function success (links) {
      var payload = [];
      for (var index = 0; index < links.length; index++) {
        payload[index] = {
          _id: links[index]._id,
          url: links[index].url,
          slug: links[index].slug,
          created: links[index].created,
          Hits: links[index].Hits.length
        }
      }
      req.data = { err: false, result: payload };
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