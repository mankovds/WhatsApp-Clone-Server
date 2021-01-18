/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:50:27 
 * @Last Modified by:   Abderrahim El imame 
 * @Last Modified time: 2019-05-18 22:50:27 
 */

'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const groupSchema = new Schema({
  name: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    ref: 'users'
  },
  /*
    notification_key: {
      type: String,
      default: null
    },*/
  members: [{
    groupId: {
      type: String,
      ref: 'groups'
    },
    userId: {
      type: String,
      ref: 'users'
    },
    left: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    },
    admin: {
      type: Boolean,
      default: false
    }
  }],
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('groups', groupSchema);