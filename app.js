const DEV = process.env.NODE_ENV == 'dev';
const VERBOSE = process.env.NODE_ENV == 'verbose';

if (DEV) var config = require('./config.json'); else var config = {};

const MACHINE_NAME = DEV ? config.MACHINE_NAME : process.env.MACHINE_NAME;
const MONGODB_URI = DEV ? config.MONGODB_URI : process.env.MONGODB_URI;
const SECRET = DEV ? config.SECRET : process.env.SECRET;
const COOKIE_DOMAIN = DEV ? config.COOKIE_DOMAIN : process.env.COOKIE_DOMAIN;
const COOKIE_MAXAGE = normalizePort(DEV ? config.COOKIE_MAXAGE : process.env.COOKIE_MAXAGE);
const APP_NAME = DEV ? config.APP_NAME : process.env.APP_NAME;

var express = require("express");
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var logger = DEV || VERBOSE ? require('morgan') : null;
var inspect = require('util').inspect;
var inspectOpts = { colors: true, depth: Infinity };
var debug = require('debug')(MACHINE_NAME + ':server');
var fs = require('fs');
var path = require('path');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var expressJwt = require('express-jwt');
var forceDomain = require('forcedomain');
var mongoose = require('mongoose');

//routes
var api = require('./routes/api');

mongoose.Promise = global.Promise;

if (DEV || VERBOSE) mongoose.set('debug', true);

var port = normalizePort(process.env.PORT || '80');
var ssl_port = normalizePort(process.env.SSL_PORT || '443');

var promise = mongoose.connect(MONGODB_URI, { useMongoClient: true });
promise.then(function (db) {
  if (DEV || VERBOSE) console.log(inspect({"MongoDB connected on port": db.port }, inspectOpts));
  go();
});

function go () {

  var app = express();

  if (DEV || VERBOSE) app.use(logger('dev'));

  if (process.env.NODE_ENV != "dev") app.use(forceDomain({
    hostname: config.cookie.domain,
    protocol: 'https'
  }));

  var session = expressSession({
    secret: SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      domain: COOKIE_DOMAIN,
      maxAge: COOKIE_MAXAGE,
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());
  app.use(bodyParser.json({ type: 'application/json'}));
  app.use(express.static(path.join(__dirname, 'www')));
  app.use(session);

  var regex = /\/api\/recover.*/;
  app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/token', '/api/auth', '/api/register', '/api/reset', regex] }));
  app.use('/api', api);

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'dev') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.status(500).json({
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.status(500).json({
      message: err.message,
      error: {}
    });
  });

  // HTTP setup

  var server = http.createServer(app);
  server.listen(port, function () {
    if (DEV || VERBOSE) console.log(inspect({ "Server listening on port": port }, inspectOpts));
  });
  server.on('error', onError);
  server.on('listening', onListening);


  // HTTPS setup

  var ssl_key_path = config.ssl.dir + config.ssl.file.key;
  var ssl_cert_path = config.ssl.dir + config.ssl.file.cert;
  var ssl_bundle_path = config.ssl.dir + config.ssl.file.bundle;

  if (fs.existsSync(ssl_key_path) && fs.existsSync(ssl_cert_path)) {

    var ssl_options = {
      key: fs.readFileSync(ssl_key_path),
      cert: fs.readFileSync(ssl_cert_path)
    };

    if (fs.existsSync(ssl_bundle_path)) ssl_options.ca = fs.readFileSync(ssl_bundle_path);

    var ssl_server = https.createServer(ssl_options, app);
    ssl_server.listen(ssl_port, function () {
      if (DEV || VERBOSE) console.log(inspect({ "SSL Server listening on port:": port }, inspectOpts));
    });
    ssl_server.on('error', onError);

  }

  //private functions

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }


}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}
