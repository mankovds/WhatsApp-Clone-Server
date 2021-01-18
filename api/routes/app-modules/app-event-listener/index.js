/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:52:05 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-07-09 11:52:13
 */

'use strict';
const EventEmitter = require('events');
const _ = require('underscore');
const notificationQueries = require('./lib/event-queries');
class UserAction extends EventEmitter {}
const userAction = new UserAction();

userAction.on("notification", (options) => {

  
 // notificationQueries.sendNotification(options);


});
module.exports = userAction;