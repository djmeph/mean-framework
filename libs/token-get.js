module.exports = Module;

function Module (req, res, next) {

  try {

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (token) {
      req.session.token = token;
      req.data = { status: 200, result: req.session.token };
      return next();
    } else if (req.session.token) {
      req.data = { status: 200, result: req.session.token };
      return next();
    } else {
      req.data = { status: 400, result: "Invalid token" };
      return next();
    }

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { status: 400, result: err.message };
    return next();
  }

}
