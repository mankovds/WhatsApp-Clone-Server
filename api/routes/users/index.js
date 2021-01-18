/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:53:23 
 * @Last Modified by:   Abderrahim El imame 
 * @Last Modified time: 2019-05-18 22:53:23 
 */

'use strict';

const usersRoute = require('express').Router();
const usersController = require('../../controllers/usersController');

usersRoute.post('/all', usersController.get_users)
  .get('/get/:userId', usersController.get_user)
  .put('/editName', usersController.edit_name)
  .post('/editImage', usersController.edit_image)
  .get('/checkNetwork', usersController.check_network)
  .get('/blockUser/:userId', usersController.block_user)
  .get('/unBlockUser/:userId', usersController.un_block_user)
  .get('/getStatus/:userId', usersController.get_status)
  .post('/addStatus', usersController.add_status)
  .delete('/deleteStatus/:statusId', usersController.delete_status)
  .delete('/deleteAllStatus', usersController.delete_all_status)
  .put('/setCurrentStatus', usersController.set_current_status)
  .get('/getAppSettings', usersController.get_app_settings)
  .post('/saveNewCall', usersController.save_new_call)
  //  .get('/getStories', usersController.get_stories)
  .post('/createStory', usersController.create_story)
  .delete('/deleteStory/:storyId', usersController.delete_story);


module.exports = usersRoute;