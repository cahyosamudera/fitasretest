var express = require('express');
var router = express.Router();
var db = require('../models');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  var users = await  db.User.findAll();
  res.send(users);
});

module.exports = router;
