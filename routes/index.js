/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:55:54 
 * @Last Modified by:   Abderrahim El imame 
 * @Last Modified time: 2019-05-18 22:55:54 
 */

'use strict';


const config = require('../config/environment');
const auth = require('../api/controllers/authController');


const API_PATH = '/api/' + config.apiVersion;
const dashboardRouter = require("./dashboard");
const installRouter = require("./install");
const staticsRouter = require("./statics");
module.exports = function(app) {
  app
    .use('', staticsRouter)
    .use('/', dashboardRouter)
    .use('/', installRouter)
    .use(API_PATH + '/files_dashboard', auth.sessionChecker(), require('../api/routes/files'))
    .use(API_PATH + '/auth', require('../api/routes/auth/'))
    .use(API_PATH + '/users', auth.isUserAuthenticated(), require('../api/routes/users/'))
    .use(API_PATH + '/groups', auth.isUserAuthenticated(), require('../api/routes/groups/'))
    .use(API_PATH + '/chats', auth.isUserAuthenticated(), require('../api/routes/chat/'))
    .use(API_PATH + '/files', auth.isUserAuthenticated(), require('../api/routes/files'));
};