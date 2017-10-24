var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* General */
var tokenGet = require('../libs/token-get');
var authPost = require('../libs/auth-post');
var passwordPut = require('../libs/password-put');
var recoverGet = require('../libs/recover-get');
var resetPost = require('../libs/reset-post');

/* User */
var userPost = require('../libs/user-post');
var userGet = require('../libs/user-get');
var userPut = require('../libs/user-put');


/* General */

router.get('/token', [bodyParser.json(), tokenGet], process);

router.post('/auth', [bodyParser.json(), authPost], process);

router.put('/password', [bodyParser.json(), passwordPut], process);

router.get('/recover/:email', [bodyParser.json(), recoverGet], process);

router.post('/reset', [bodyParser.json(), resetPost], process);

router.delete('/token', deleteToken);

/* User */

router.post('/register', [bodyParser.json(), userPost], process);

router.get('/user', [bodyParser.json(), userGet], process);

router.put('/user', [bodyParser.json(), userPut], process);

module.exports = router;

function process (req, res) {
  res.status(req.data.status).json(req.data.result);
}

function deleteToken (req, res) {
  try {
    delete req.session.token;
    return res.send(200);
  } catch (err) { res.status(500).send(err.message); }
}
