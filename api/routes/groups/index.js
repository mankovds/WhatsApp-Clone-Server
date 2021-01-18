/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:53:15 
 * @Last Modified by:   Abderrahim El imame 
 * @Last Modified time: 2019-05-18 22:53:15 
 */

'use strict';

const groupsRoute = require('express').Router();
const groupsController = require('../../controllers/groupsController');

groupsRoute
  //.get('/all', groupsController.get_group_list)
  .get('/get/:groupId', groupsController.get_group)
  .post('/createGroup', groupsController.create_group)
  .post('/addMembersToGroup', groupsController.add_members_to_group)
  .post('/removeMemberFromGroup', groupsController.remove_member_from_group)
  .post('/makeMemberAdmin', groupsController.make_member_admin)
  .post('/makeAdminMember', groupsController.make_admin_member)
  .post('/editGroupName', groupsController.edit_group_name)
  .post('/editGroupImage', groupsController.edit_group_image)
  .post('/exitGroup', groupsController.exit_group)
  .delete('/deleteGroup/:groupId/:userId/:conversationId', groupsController.delete_group);


module.exports = groupsRoute;