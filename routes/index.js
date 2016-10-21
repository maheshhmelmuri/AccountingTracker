var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var random= 'my main application';
  res.render('home', { title: 'Accounting Tracker', somename: 'string val'});

});

module.exports = router;
