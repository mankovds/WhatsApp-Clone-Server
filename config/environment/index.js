/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:54:52 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-12-03 16:10:57
 */

'use strict';

const path = require('path');
const _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
const all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../'),
  rootFiles: path.normalize(__dirname + './../../uploads-store'),

  apiVersion: 'v1',

  // Server port
  port: process.env.PORT || 9001,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  jwt_secret: {
    session: 'DBbFZX3ZsUPRVniUA1Y1020NZzhRasrApsjGlPg2Nq8vB',
    token_expiration: 86400 // expires in 24 hour
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  host: process.env.HOSTNAME || 'http://localhost:9001',

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});