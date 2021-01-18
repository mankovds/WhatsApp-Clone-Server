/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:53:57 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-08-18 17:05:24
 */

'use strict';

const usersModule = require('../routes/app-modules/app-users');

var mongo = require('mongodb'),
  ObjectID = mongo.ObjectID;

module.exports = function () {

  return {


    updateUser: function (options, callback) {
      callback = callback || function () { };
      return new Promise((resolve, reject) => {

        usersModule.usersQueries.editUserState({
          userId: ObjectID(options.userId),
          socketId: options.socketId,
          connected: options.connected,
          last_seen: options.last_seen

        })
          .then((response) => { 
            resolve(response);
            return callback(null, response);
          })
          .catch((err) => {
 
            reject(new Error('error ' + err));
            return callback(new Error('error' + err));
          });
      });
    },

    getUser: function (options, callback) {
      callback = callback || function () { };
      return new Promise((resolve, reject) => { 

        usersModule.usersQueries.getUser(options.userId)
          .then((response) => {
            resolve(response);
            return callback(null, response);
          })
          .catch((err) => {
            reject(new Error('error ' + err));
            return callback(new Error('error' + err));
          });
      });
    },
    getUserBySocketID: function (options, callback) {

      callback = callback || function () { };
      return new Promise((resolve, reject) => {

        usersModule.usersQueries.getUserBySocketID(options.socketId)
          .then((response) => {
            resolve(response);
            return callback(null, response);
          })
          .catch((err) => {
            reject(new Error('error ' + err));
            return callback(new Error('error' + err));
          });
      });
    }
  }
};