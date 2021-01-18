/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:55:39 
 * @Last Modified by:   Abderrahim El imame 
 * @Last Modified time: 2019-05-18 22:55:39 
 */

var express = require('express');
var router = express.Router();
var config = require('../../config/environment');
var config_db = require('../../config/config.js');
var path = require('path');


router.get('/doc', function(req, res, next) {
  res.sendFile(path.join(config.root, 'doc/index.html'));
});

router.get('/', function(req, res, next) {

  if (config_db.db.username == null) {
    res.redirect('/install');
  } else {
    res.render('layout');
  }
});



module.exports = router;