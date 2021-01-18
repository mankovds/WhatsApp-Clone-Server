/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:50:42 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-08-20 09:45:31
 */

'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.plugin(schema => {
  schema.options.usePushEach = true
});
const usersSchema = new Schema({
  username: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    unique: true,
    default: null
  },
  country: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  activated: {
    type: Boolean,
    default: false
  },
  auth_token: {
    type: String,
    default: null
  },
  verify_code: {
    type: String,
    unique: true,
    default: null
  },
  socketId:{
    type: String, 
    default: null
  },
  connected:{
    type: Boolean, 
    default: false
  },
  last_seen:{
    type: Date,
    default: Date.now
  },
  blocking: [{
    userId: {
      type: String,
      ref: 'users'
    },
    created: {
      type: Date,
      default: Date.now
    }
  }],
  calls: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
    created: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: String,
      default: "0"
    },
    type: {
      type: String,
      default: null
    },
    deleted: {
      type: Boolean,
      default: false
    },
    sent: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
    seen: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }]
  }],
  stories: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
    created: {
      type: Date,
      default: Date.now
    },
    file: {
      type: String,
      default: null
    },
    body: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    duration: {
      type: String,
      default: "0"
    },
    deleted: {
      type: Boolean,
      default: false
    },
    sent: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
    expired: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
    seen: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }]
  }],

  status: [{
    body: {
      type: String,
      default: null
    },
    userId: {
      type: String,
      ref: 'users'
    },
    current: {
      type: Boolean,
      default: false
    },
    is_default: {
      type: Boolean,
      default: false
    },
    created: {
      type: Date,
      default: Date.now
    }
  }],
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('users', usersSchema);