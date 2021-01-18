/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:52:52 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-11-07 13:22:50
 */

'use strict';

const authRoute = require('express').Router();
const authController = require('../../controllers/authController');


authRoute 
  .post('/join', authController.join_user)
  .post('/verifyUser', authController.verify_user)
  .post('/resend', authController.resend_sms)
  .post('/deleteAccount', authController.delete_account)
  .post('/deleteConfirmation', authController.delete_confirmation);



module.exports = authRoute;