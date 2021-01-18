/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:50:15 
 * @Last Modified by:   Abderrahim El imame 
 * @Last Modified time: 2019-05-18 22:50:15 
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'groups'
  },
  messages: [{

    sent: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
    delivered: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
    seen: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
    deleted: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
    state: {
      type: String,
      default: "normal"
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'groups'
    },
    reply_id: {
      type: String,
      default: null
    },
    reply_message: {
      type: Boolean,
      default: true
    },
    message: {
      type: String,
      default: null
    },
    longitude: {
      type: String,
      default: null
    },
    latitude: {
      type: String,
      default: null
    },
    file: {
      type: String,
      default: null
    },
    file_type: {
      type: String,
      default: null
    },
    file_size: {
      type: String,
      default: null
    },
    duration_file: {
      type: String,
      default: null
    },
    document_name: {
      type: String,
      default: null
    },
    document_type: {
      type: String,
      default: null
    },
    created: {
      type: Date,
      default: Date.now
    }

  }],
  created: {
    type: Date,
    default: Date.now
  },

});

module.exports = mongoose.model('chat', chatSchema, 'chat');