var express = require('express');
var router = express.Router();

var redirect = require('../libs/redirect');

/* Lookup URL redirect and forward */
router.get('/:slug', redirect, function (req, res) {
  if (req.data.err) res.status(404).type('txt').send('Not found');
  else res.redirect(302, req.data.url);
});

/* Forward root to djmeph.net  */
router.get('/', function (req, res) {
  res.redirect(302, 'http://djmeph.net/');
});


module.exports = router;