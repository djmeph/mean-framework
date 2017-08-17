module.exports = function (req, res, next) {

  try {

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (token) {
      req.session.token = token;
      req.data = { err: false, token: req.session.token };
      return next();
    } else if (req.session.token) {
      req.data = { err: false, token: req.session.token };
      return next();
    } else {
      req.data = { err: true, msg: "Invalid token" };
      return next();
    }

  } catch (err) {
    if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err)
    req.data = { err: true, msg: err.message };
    return next();
  }

};