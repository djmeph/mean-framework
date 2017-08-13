var express = require('express');
var router = express.Router();
var config = require('../config.json');

var redirect = require('../libs/redirect');
var Hit = require('../services/hit');

/* Lookup URL redirect and forward */
router.get('/:slug', redirect, function (req, res) {
  if (req.data.err) res.status(404).type('txt').send('Not found');
  else res.redirect(302, req.data.url);
});

/* Forward root to djmeph.net  */
router.get('/', function (req, res) {

  Hit.post({
    address: req.connection.remoteAddress,
    useragent: req.headers['user-agent'],
    Link: config.djmeph_id
  });

  res.redirect(302, 'http://djmeph.net/');

});


module.exports = router;