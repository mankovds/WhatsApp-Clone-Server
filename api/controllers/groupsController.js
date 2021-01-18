/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:48:22 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-05-18 22:57:53
 */

'use strict';


const GroupSchema = require('../models/groups');
const groupsModule = require('../routes/app-modules/app-groups');

var mongoose = require('mongoose');




/**
 * @api {post} /api/v1/groups/createGroup 1. Create group
 * @apiVersion 0.1.0
 * @apiName CreateGroup
 * @apiGroup  Groups
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String}  message The response message.
 * @apiParam {Array} ids  users Ids .
 * @apiParam {String} image  the group image .
 * @apiParam {String} name  the group name .
 * @apiParam {String} createTime  the group created Time .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'Your group has been created successfully.'
 *  }
 */
exports.create_group = function (req, res) {

  if (!req.body.image || !req.body.name || !req.body.ids || !req.body.createTime) {
    res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    groupsModule.groupsQueries.createGroup({
        name: req.body.name,
        user: req.user,
        image: req.body.image,
        ids: req.body.ids,
        createTime: req.body.createTime

      })
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: " " + err
        });

      });
  }
};


/**
 * @api {post} /api/v1/groups/addMembersToGroup 2. Add member to group
 * @apiVersion 0.1.0
 * @apiName addMembersToGroup
 * @apiGroup  Groups
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String}  message The response message.
 * @apiParam {String} userId  the user id .
 * @apiParam {String} groupId  the group id .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'Member(s)  has been added to group successfully.'
 *  }
 */
exports.add_members_to_group = function (req, res) {

  if (!req.body.userId || !req.body.groupId) {
    res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    groupsModule.groupsQueries.addMembersToGroup({
        userId: req.body.userId,
        groupId: req.body.groupId
      })
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: " " + err
        });

      });
  }
};


/**
 * @api {post} /api/v1/groups/removeMemberFromGroup 3. Remove member from group
 * @apiVersion 0.1.0
 * @apiName removeMemberFromGroup
 * @apiGroup  Groups
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String}  message The response message.
 * @apiParam {String} userId  the user id .
 * @apiParam {String} groupId  the group id .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'Member  has been removed from group successfully.'
 *  }
 */
exports.remove_member_from_group = function (req, res) {

  if (!req.body.userId || !req.body.groupId) {
    res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    groupsModule.groupsQueries.removeMemberFromGroup({
        userId: req.body.userId,
        groupId: req.body.groupId
      })
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: " " + err
        });

      });
  }
};



/**
 * @api {post} /api/v1/groups/makeMemberAdmin 4. Make member as admin
 * @apiVersion 0.1.0
 * @apiName makeMemberAdmin
 * @apiGroup  Groups
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String}  message The response message.
 * @apiParam {String} userId  the user id .
 * @apiParam {String} groupId  the group id .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'You made the member as admin successfully.'
 *  }
 */
exports.make_member_admin = function (req, res) {

  if (!req.body.userId || !req.body.groupId) {
    res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    groupsModule.groupsQueries.makeMemberAdmin({
        userId: req.body.userId,
        groupId: req.body.groupId
      })
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: " " + err
        });

      });
  }
};


/**
 * @api {post} /api/v1/groups/makeAdminMember 5. Make admin as member
 * @apiVersion 0.1.0
 * @apiName makeAdminMember
 * @apiGroup  Groups
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String}  message The response message.
 * @apiParam {String} userId  the user id .
 * @apiParam {String} groupId  the group id .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'You made the admin as member successfully.'
 *  }
 */
exports.make_admin_member = function (req, res) {

  if (!req.body.userId || !req.body.groupId) {
    res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    groupsModule.groupsQueries.makeAdminMember({
        userId: req.body.userId,
        groupId: req.body.groupId
      })
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: " " + err
        });

      });
  }
};



/**
 * @api {post} /api/v1/groups/editGroupName 6. Edit group name
 * @apiVersion 0.1.0
 * @apiName editGroupName
 * @apiGroup  Groups
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String}  message The response message.
 * @apiParam {String} groupName  the group name .
 * @apiParam {String} groupId  the group id .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'Group name is changed successfully.'
 *  }
 */
exports.edit_group_name = function (req, res) {
  if (!req.body.name) {
    return res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    groupsModule.groupsQueries.editGroupName({
        groupId: req.body.groupId,
        name: req.body.name
      })
      .then((group) => {
        return res.send(group);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: " " + err
        });
      });
  }
};

/**
 * @api {post} /api/v1/groups/editGroupImage 7. Edit group image
 * @apiVersion 0.1.0
 * @apiName editGroupImage
 * @apiGroup  Groups
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String}  message The response message.
 * @apiParam {String} groupImage the group image .
 * @apiParam {String} groupId  the group id .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'Group image is changed successfully.'
 *  }
 */
exports.edit_group_image = function (req, res) {
  if (!req.body.image) {
    return res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    groupsModule.groupsQueries.editGroupImage({
        groupId: req.body.groupId,
        image: req.body.image
      })
      .then((group) => {
        return res.send(group);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: " Error " + err
        });
      });
  }
};


/**
 * @api {post} /api/v1/groups/exitGroup 8. Leave group
 * @apiVersion 0.1.0
 * @apiName exitGroup
 * @apiGroup  Groups
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String}  message The response message.
 * @apiParam {String} groupId  the group id .
 * @apiParam {String} userId  the user id .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'You left this group successfully.'
 *  }
 */
exports.exit_group = function (req, res) {

  if (!req.body.groupId || !req.body.userId) {
    return res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    groupsModule.groupsQueries.exitGroup({
        groupId: req.body.groupId,
        userId: req.body.userId
      })
      .then((group) => {
        return res.send(group);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: " " + err
        });
      });
  }
};


/**
 * @api {delete} /api/v1/groups/deleteGroup/:groupId/:userId 9. Delete group
 * @apiVersion 0.1.0
 * @apiName deleteGroup
 * @apiGroup  Groups
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String}  message The response message.
 * @apiParam {String} groupId  the group id .
 * @apiParam {String} userId  the user id .
 * @apiParam {String} conversationId  the conversation id .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'You delete  group successfully.'
 *  }
 */
exports.delete_group = function (req, res) {
  req.checkParams('groupId', 'Invalid group id').isMongoId();
  req.checkParams('userId', 'Invalid group id').isMongoId();
  let errors = req.validationErrors();
  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    groupsModule.groupsQueries.deleteGroup({
        groupId: req.params.groupId,
        conversationId: req.params.conversationId,
        user: req.user,
        userId: req.params.userId
      })
      .then((group) => {
        return res.send(group);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: " " + err
        });
      });
  }
};
/**
 * @api {get} /api/v1/groups/get/:groupId 10. Get group
 * @apiVersion 0.1.0
 * @apiName getGroup
 * @apiGroup  Groups
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String}  message The response message.
 * @apiParam {String} groupId  the group id .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
    "_id": "5be4267e80b2a50319875cae",
    "created": "2018-11-08T12:05:18.250Z",
    "members": [
        {
            "groupId": "5be4267e80b2a50319875cae",
            "_id": "5be4267e80b2a50319875caf",
            "admin": false,
            "deleted": false,
            "left": false,
            "owner": {
                "_id": "5bb622fdee4d888277805a63",
                "status": {
                    "_id": "5bb622fdee4d888277805a64",
                    "userId": "5bb622fdee4d888277805a63",
                    "created": "2018-10-04T14:26:05.555Z",
                    "current": true,
                    "body": "Only Emergency calls"
                },
                "image": "7e5eaeb0-bda4-11e7-8d81-818a53af3609.jpg",
                "phone": "+212670022191",
                "username": null,
                "linked": true,
                "exist": true,
                "activate": true
            }
        },
        {
            "groupId": "5be4267e80b2a50319875cae",
            "_id": "5be4267e80b2a50319875cb0",
            "admin": true,
            "deleted": false,
            "left": false,
            "owner": {
                "_id": "5bb614f11a38dd7fe29fd621",
                "status": {
                    "_id": "5bb622fdee4d888277805a6a",
                    "userId": "5bb622fdee4d888277805a63",
                    "created": "2018-10-04T14:26:05.557Z",
                    "current": true,
                    "body": "Hey i am using whatsclone enjoy it"
                },
                "image": "ef58ffd0-c7b7-11e8-9988-5109688ba2f0.png",
                "phone": "+212633909681",
                "username": null,
                "linked": true,
                "exist": true,
                "activate": true
            }
        }
    ],
    "image": "null",
    "name": "Good job group",
    "owner": {
        "_id": "5bb614f11a38dd7fe29fd621",
        "status": {
            "_id": "5bb622fdee4d888277805a6a",
            "userId": "5bb622fdee4d888277805a63",
            "created": "2018-10-04T14:26:05.557Z",
            "current": true,
            "body": "Hey i am using whatsclone enjoy it"
        },
        "image": "ef58ffd0-c7b7-11e8-9988-5109688ba2f0.png",
        "phone": "+212633909681",
        "username": null,
        "linked": true,
        "exist": true,
        "activate": true
    }
}
 */
exports.get_group = function (req, res) {
  req.checkParams('groupId', 'Invalid group id').isMongoId();
  let errors = req.validationErrors();
  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    groupsModule.groupsQueries.getGroup({
        groupId: req.params.groupId
      })
      .then((group) => {
        return res.send(group);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: " " + err
        });
      });
  }
};