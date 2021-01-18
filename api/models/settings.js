/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:50:33 
 * @Last Modified by:   Abderrahim El imame 
 * @Last Modified time: 2019-05-18 22:50:33 
 */

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var settingSchema = new Schema({

  name: {
    type: String,
    default: null
  },
  value: {
    type: String,
    default: null
  }

});

module.exports = mongoose.model('settings', settingSchema);