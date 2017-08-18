var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* General */
var tokenGet = require('../libs/token-get');
var authPost = require('../libs/auth-post');

/* Account */
var userPost = require('../libs/user-post');
var userGet = require('../libs/user-get');

/* Link */
var linksGet = require('../libs/links-get');
var linkPost = require('../libs/link-post');


/* General */

router.get('/token', [bodyParser.json(), tokenGet], function (req, res) {
  if (req.data.err) res.status(400).send(req.data.msg);
  else res.status(200).json(req.data.token);
});

router.post('/auth', [bodyParser.json(), authPost], function (req, res) {
  if (req.data.err) res.status(401).send(req.data.msg); 
  else res.status(200).json({ token: req.session.token, user: req.data.user });
});

router.delete('/token', function (req, res) {
  try {
    delete req.session.token;
    return res.sendStatus(200);
  } catch (err) { res.status(400).send(err.message); }
});

/* Account */

router.post('/register', [bodyParser.json(), userPost], function (req, res) {
  if (req.data.err) res.status(500).send(req.data.msg); 
  else res.status(200).json({ token: req.session.token, username: req.data.username });
});

router.get('/user', [bodyParser.json(), userGet], function (req, res) {
  if (req.data.err) res.status(500).send(req.data.msg);
  else res.status(200).json(req.data.result);
});

/* Link */

router.get('/links', [bodyParser.json(), linksGet], function (req, res) {
  if (req.data.err) res.status(500).send(req.data.msg);
  else res.status(200).json(req.data.result);
});

router.post('/link', [bodyParser.json(), linkPost], function (req, res) {
  if (req.data.err) res.status(500).send(req.data.msg); 
  else res.status(200).send();
});

module.exports = router;