/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:56:02 
 * @Last Modified by:   Abderrahim El imame 
 * @Last Modified time: 2019-05-18 22:56:02 
 */

var express = require('express');
var router = express.Router();
var https = require("https");
var queryString = require("querystring");
var config = require('../config/environment');
var config_db = require('../config/config.js');
const fs = require('fs');
var path = require('path');
var authorized_token = "eyJwaG9uZSI6IisyMTI2MzM3MTExMDAiLCJpYXQiOjE1NDQ3OTc4ODMsImV4cCI6MTU0NDg4NDI4M30.3Yj3yyP2oKHp-DMbmGJW2swx2vTj6solzbIbOyhVwUU";




//installation script
router.get('/install', function (req, res, next) {

  if (config_db.db.username == null) {
    res.render('install/index', {
      success: false,
      message: null
    });
  } else {
    res.redirect('/admin/login');
  }

});

router.post('/install', (req, res) => {
  req.checkBody('db_name', 'The database  name field  is required').notEmpty();
  req.checkBody('db_user_name', 'The name filed is required').notEmpty();
  req.checkBody('db_user_password', 'The password is invalid').isLength(6, 16);
  req.checkBody('p_name', 'The personal name filed is required').notEmpty();
  req.checkBody('email', 'Invalid email').isEmail();
  req.checkBody('purchase_code', 'The purchase code filed is required').notEmpty();
  req.checkBody('server_ip', 'The server Ip is required').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    res.render('install/index', {
      success: false,
      message: errors[0].msg
    });
  } else {

    req.body.uri = req.body.server_name;


    //if (req.body.server_ip == "127.0.0.1") {


      const configPath = path.join(config.root, 'config/config.js');
      var result;
      if (req.body.server_name != '')
        result = "'use strict'" + ";\nlet config = {};  \nconfig.db = {}; \n \n \nconfig.db.password = " + "'" + req.body.db_user_password + "'" + "; \nconfig.db.username = " + "'" + req.body.db_user_name + "'" + ";\nconfig.db.name = " + "'" + req.body.db_name + "'" + ";\nconfig.db.serverName = " + "'" + req.body.server_name + "'" + ";\nconfig.db.authMechanism = 'SCRAM-SHA-1';\n  \n \nmodule.exports = config;"
      else
        result = "'use strict'" + ";\nlet config = {};  \nconfig.db = {}; \n \n \nconfig.db.password = " + "'" + req.body.db_user_password + "'" + "; \nconfig.db.username = " + "'" + req.body.db_user_name + "'" + ";\nconfig.db.name = " + "'" + req.body.db_name + "'" + ";\nconfig.db.serverName = " + "'" + req.body.server_ip + "'" + ";\nconfig.db.authMechanism = 'SCRAM-SHA-1';\n  \n \nmodule.exports = config;"

      fs.writeFile(configPath, result, 'utf8', function (err) {
        if (err) {


          res.render('install/index', {
            success: false,
            message: 'Error,Opps something went wrong please try again'
          });
        } else {
          res.redirect('/admin/login');


        }
      });
   /* } else {
      let verfiyBody = {
        "server_ip": req.body.server_ip,
        "uri": req.body.server_name,
        "purchase_code": req.body.purchase_code,
        "email": req.body.email,
        "p_name": req.body.p_name
      }

      var qs = queryString.stringify(verfiyBody);

      var options = {
        host: "strolink.com",
        path: "/verification/v1/verify",
        method: "POST",
        type: "json",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": authorized_token
        }
      };
      var request = https.request(options, function (res1) {
        var responseString = "";

        res1.on("data", function (data) {
          responseString += data;
        });
        res1.on("end", function () {

          var obj = JSON.parse(responseString);
          if (obj.success) {
            const configPath = path.join(config.root, 'config/config.js');
            var result;
            if (req.body.server_name != '')
              result = "'use strict'" + ";\nlet config = {};  \nconfig.db = {}; \n \n \nconfig.db.password = " + "'" + req.body.db_user_password + "'" + "; \nconfig.db.username = " + "'" + req.body.db_user_name + "'" + ";\nconfig.db.name = " + "'" + req.body.db_name + "'" + ";\nconfig.db.serverName = " + "'" + req.body.server_name + "'" + ";\nconfig.db.authMechanism = 'SCRAM-SHA-1';\n  \n \nmodule.exports = config;"
            else
              result = "'use strict'" + ";\nlet config = {};  \nconfig.db = {}; \n \n \nconfig.db.password = " + "'" + req.body.db_user_password + "'" + "; \nconfig.db.username = " + "'" + req.body.db_user_name + "'" + ";\nconfig.db.name = " + "'" + req.body.db_name + "'" + ";\nconfig.db.serverName = " + "'" + req.body.server_ip + "'" + ";\nconfig.db.authMechanism = 'SCRAM-SHA-1';\n  \n \nmodule.exports = config;"

            fs.writeFile(configPath, result, 'utf8', function (err) {
              if (err) {

                res.render('install/index', {
                  success: false,
                  message: 'Error,Opps something went wrong please try again'
                });
              } else {
                res.redirect('/admin/login');
              }
            });
          } else {
            res.render('install/index', obj);
          }

        });
      });

      request.write(qs);
      request.end();
    }*/
  }
});


module.exports = router;