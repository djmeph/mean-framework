var parse = require('parse-bearer-token');

module.exports = Module;

function Module (req, res, next) {

  try {

    var token = parse(req);

    if (token) {
      req.session.token = token;
      req.data = { status: 200, result: { token: req.session.token } };
    } else if (req.session.token) {
      req.data = { status: 200, result: { token: req.session.token } };
    } else {
      req.data = { status: 500, result: { message: "Invalid token" } };
    }
    return next();

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 500, result: err };
    return next();
  }

}
