/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:50:08 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-05-18 22:57:58
 */

'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

mongoose.plugin(schema => {
  schema.options.usePushEach = true
});
const adminSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  salt: {
    type: String
  },
  hashedPassword: {
    type: String
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  }
});



adminSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },
  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = Buffer.from(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
  }
};
adminSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });



adminSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');



adminSchema.index({
  username: 'text',
  email: 'text'
});

module.exports = mongoose.model('admins', adminSchema, 'admins');