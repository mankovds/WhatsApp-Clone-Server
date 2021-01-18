/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:51:59 
 * @Last Modified by:   Abderrahim El imame 
 * @Last Modified time: 2019-05-18 22:51:59 
 */

'use strict';

const https = require("https");
const async = require('async');

const adminModule = require('../../app-admin');
module.exports = (function () {

  let _sendNotification = (options) => {
   
    async.parallel({
      settings: function (cb) {
        adminModule.adminQueries.getSettings()
          .then((settings) => {
            cb(null, settings);
          })
          .catch((err) => {
   
            cb(null);
          });
      }

    },
      function everything(err, results) {
        if (err
           || !results.settings 
          || !results.settings.google_api_key
          || !results.settings.topic)
          return ;

          
          
          var fcmMessage = {
            "to": "/topics/com.sourcecanyon.whatsClone",
            "priority": "high",
            "data": {
              "topic": results.settings.topic
            }
          }
          var options = {
            host: "fcm.googleapis.com",
            path: "/fcm/send",
            method: "POST",
            headers: {
              "Authorization": "key=" + results.settings.google_api_key,
              "Content-Type": "application/json"
            }
          };
          var request = https.request(options, function (resp) {
            resp.setEncoding("utf8");
            resp.on("data", function (data) {
              if (resp.statusCode != 200) {
                console.log('failed to sent message:', resp.statusCode);
              } else {
                console.log("Message sent to Firebase for delivery, response:");
              
              }
            });
          });
          request.on("error", function (err) {
            console.log("Unable to send message to Firebase");
            console.log(err.message);
          });
          request.write(JSON.stringify(fcmMessage));
          request.end();
        });

    
  }
  return {
    sendNotification: _sendNotification
  };
})();