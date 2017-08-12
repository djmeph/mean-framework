var express = require("express");
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var logger = process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose" ? require('morgan') : null;
var cookieParser = require('cookie-parser');
var debug = require('debug')('naked-bike:server');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") mongoose.set('debug', true);

var config = require('./config.json');
var port = normalizePort(process.env.PORT || '80');
var ssl_port = normalizePort(process.env.SSL_PORT || '443');

if (process.env.NODE_ENV == "dev") mongoose.connect("mongodb://" + config.mongo.domain + ":" + config.mongo.port + "/" + config.mongo.db);

else {

  mongoose.connect(config.mongo.domain, config.mongo.db, config.mongo.port, {
    user: config.mongo.user,
    pass: config.mongo.pwd,
    auth: { authdb: config.mongo.authdb }
  });

}

var db = mongoose.connection;
db.once('open', function () {
  if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log("mongodb connected");
});

var app = express();

if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'www')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('*', function (req, res) {
  res.status(404).type('txt').send('Not found');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// HTTP setup

var server = http.createServer(app);
server.listen(port, function () {
  if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log('Server listening on port: ' + port);
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
    if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log('SSL Server listening on port: ' + ssl_port);
  });
  ssl_server.on('error', onError);

}


//private functions

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

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