var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* Account */
var userPost = require('../libs/user-post');


/* Account */

router.post('/user', [bodyParser.json(), userPost], function (req, res) {
  if (req.data.err) res.status(500).send(req.data.msg); 
  else res.status(200).json({ token: req.session.token, username: req.data.username });
});

module.exports = router;