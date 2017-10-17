const DEV = process.env.NODE_ENV == 'dev';
const VERBOSE = process.env.NODE_ENV == 'verbose';

if (DEV) var config = require('./config.json'); else var config = {};

const PORT = DEV ? config.PORT : process.env.PORT;
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

  if (DEV || VERBOSE) app.use(logger('dev'));

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

  var port = normalizePort(PORT);
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

function normalizePort (val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}
