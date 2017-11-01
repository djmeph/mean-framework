const DEV = process.env.NODE_ENV == 'dev';
const VERBOSE = process.env.NODE_ENV == 'verbose';

if (DEV) var config = require('./config.json'); else var config = {};

const PORT = DEV ? config.PORT : process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const MACHINE_NAME = DEV ? config.MACHINE_NAME : process.env.MACHINE_NAME;
const MONGODB_URI = DEV ? config.MONGODB_URI : process.env.MONGODB_URI;
const SECRET = DEV ? config.SECRET : process.env.SECRET;
const COOKIE_DOMAIN = DEV ? config.COOKIE_DOMAIN : process.env.COOKIE_DOMAIN;
const COOKIE_MAXAGE = DEV ? config.COOKIE_MAXAGE : process.env.COOKIE_MAXAGE;
const APP_NAME = DEV ? config.APP_NAME : process.env.APP_NAME;
const GMAIL_ADDRESS = DEV ? config.GMAIL_ADDRESS : process.env.GMAIL_ADDRESS;
const GMAIL_PASSWORD = DEV ? config.GMAIL_PASSWORD : process.env.GMAIL_PASSWORD;
const NOREPLY_EMAIL = DEV ? config.NOREPLY_EMAIL : process.env.NOREPLY_EMAIL;
const SALT_WORK_FACTOR = DEV ? config.SALT_WORK_FACTOR : process.env.SALT_WORK_FACTOR;

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
var mongoose = require('mongoose');

//routes
var api = require('./routes/api');

mongoose.Promise = global.Promise;
if (DEV || VERBOSE) mongoose.set('debug', true);
var promise = mongoose.connect(MONGODB_URI, { useMongoClient: true });
promise.then(go, fail);

function go (db) {
  if (DEV || VERBOSE) console.log(inspect({"MongoDB connected on port": db.port }, inspectOpts));

  var app = express();

  app.set('PORT', PORT);
  app.set('NODE_ENV', NODE_ENV);
  app.set('MACHINE_NAME', MACHINE_NAME);
  app.set('MONGODB_URI', MONGODB_URI);
  app.set('SECRET', SECRET);
  app.set('COOKIE_DOMAIN', COOKIE_DOMAIN);
  app.set('COOKIE_MAXAGE', normalize(COOKIE_MAXAGE));
  app.set('APP_NAME', APP_NAME);
  app.set('GMAIL_ADDRESS', GMAIL_ADDRESS);
  app.set('GMAIL_PASSWORD', GMAIL_PASSWORD);
  app.set('NOREPLY_EMAIL', NOREPLY_EMAIL);
  app.set('SALT_WORK_FACTOR', NOREPLY_EMAIL);

  if (DEV || VERBOSE) app.use(logger('dev'));

  var session = expressSession({
    secret: SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      domain: COOKIE_DOMAIN,
      maxAge: normalize(COOKIE_MAXAGE),
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ type: 'application/json'}));
  app.use(express.static(path.join(__dirname, 'www')));
  app.use(session);

  var regex = /\/api\/recover.*/;
  app.use('/api', expressJwt({ secret: SECRET }).unless({ path: ['/api/token', '/api/auth', '/api/register', '/api/reset', regex] }));
  app.use('/api', api);

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

  var port = normalize(PORT);
  var server = http.createServer(app);
  server.listen(port, listening);
  server.on('error', onError);
  server.on('listening', onListening);

  function listening () {
    if (DEV || VERBOSE) console.log(inspect({ "Server listening on port": port }, inspectOpts));
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

function fail (err) {
  if (DEV || VERBOSE) console.log(inspect(db, opts));
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalize (val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}
