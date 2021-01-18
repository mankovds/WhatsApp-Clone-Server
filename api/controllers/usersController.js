/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:49:58 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-12-20 14:43:18
 */

'use strict';


const usersModule = require('../routes/app-modules/app-users');

var mongoose = require('mongoose');


/**
 * @api {get} /api/v1/users/checkNetwork  1.Check Network
 * @apiVersion 0.1.0
 * @apiName CheckNetwork
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *       {
 *         "success": true,
 *         "message": 'connected.'
 *       }
 */
exports.check_network = function (req, res) {
  return res.send({
    success: true,
    message: 'Connected'
  });
};


/**
 * @api {get} /api/v1/users/all  2.Get users list
 * @apiVersion 0.1.0
 * @apiName UsersList
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiSuccess {Array} users list Response .
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *
 * [
    {
    "_id": "59ecfe89a79ccb0a5b991d6c",
    "contactId": "14795",
    "username": "3.jalil N5ali",
    "linked": true,
    "activate": false,
    "exist": true,
    "phone": "+212666717200",
    "image": null,
    "status": {
        "_id": "59efb0f8e5c51c09193eeaf2",
        "userId": "59ecfe89a79ccb0a5b991d6c",
        "created": "2017-10-24T21:30:32.804Z",
        "current": true,
        "body": "in a meeting"
    }
},
{
    "_id": "17716",
    "contactId": "17716",
    "username": "3.jalil nkhali",
    "linked": false,
    "activate": false,
    "exist": true,
    "phone": "+212638969974",
    "status": null
}
]
 */
exports.get_users = (req, res, next) => {
  usersModule.usersQueries.comparePhoneNumbers({
      users_list: req.body.usersModelList
    })
    .then((usersList) => {
      return res.send(usersList);
    })
    .catch((err) => {
      return res.send({
        success: false,
        message: "Error : " + err.message
      });
      /*
      'success' => false,
      'message' => 'Oops! some params are missing.'*/
    });
};



/**
 * @api {get} /api/v1/users/get/:userId  3.Get  single user
 * @apiVersion 0.1.0
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiParam {String} userId Put the user ID to get information .
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
    "_id": "59efb0f8e5c51c09193eeaee",
    "username": "Bencherif",
    "phone": "+212633909681",
    "image": null,
    "status": {
        "_id": "59efb0f8e5c51c09193eeaf2",
        "userId": "59efb0f8e5c51c09193eeaee",
        "created": "2017-10-24T21:30:32.804Z",
        "current": true,
        "body": "in a meeting"
    },
    "activate": true,
    "linked": true,
    "has_backup": false,
    "backup_hash": null
}*/
exports.get_user = (req, res, next) => {
  req.checkParams('userId', 'The user ID is an invalid hex-encoded representation of a MongoDB ObjectId.').isMongoId();

  let errors = req.validationErrors();

  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    let userId = req.params.userId;
    usersModule.usersQueries.getUser(userId)
      .then((user) => {
        return res.send(user);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: "Error : " + err.message
        });
      });

    /*  success: false,
      message: 'Oops! some params are missing.' //err.message
      */
  }
};

/**
 * @api {post} /api/v1/users/updateRegisteredId  4.Update register Id
 * @apiVersion 0.1.0
 * @apiName updateRegisteredId
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiParam {String} registeredId body the user content.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *       {
 *         "success": true,
 *         "message": 'Registered Id is updated successfully.'
 *       }
 */
exports.update_registered_id = function (req, res) {
  usersModule.usersQueries.updateRegisteredId({
      registeredId: req.body.registeredId,
      userId: req.user._id
    })
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.send({
        success: false,
        message: "Error : " + err.message,
        registered_id: null
      });
      /*
      'success' => false,
      'message' => 'Oops! some params are missing.'*/
    });
};

/**
 * @api {get} /api/v1/users/blockUser/:userId 5.Block a user
 * @apiVersion 0.1.0
 * @apiName blockUser
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiParam {String} userId the user unique ID.
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *       {
 *         "success": true,
 *         "message": 'User has been added to blocking list'
 *       }
 */
exports.block_user = (req, res, next) => {
  req.checkParams('userId', 'Invalid user id').isMongoId();
  let errors = req.validationErrors();
  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    usersModule.usersQueries.blockUser({
        user: req.user,
        userId: req.params.userId
      })
      .then((user) => {
        return res.send({
          success: true,
          message: 'User has been added to blocking list'
        });
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: "Error : " + err.msg
        });
      });
  }
};

/**
 * @api {get} /api/v1/users/blockUser/:userId 6.UnBlock a user
 * @apiVersion 0.1.0
 * @apiName unblockUser
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiParam {String} userId the user unique ID.
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"

 * @apiSuccessExample {json} Success-Response:
 *       {
 *         "success": true,
 *         "message": 'User has been removed from blocking list'
 *       }
 */
exports.un_block_user = (req, res, next) => {
  req.checkParams('userId', 'Invalid user id').isMongoId();
  let errors = req.validationErrors();
  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    usersModule.usersQueries.unBlockUser({
        user: req.user,
        userId: req.params.userId
      })
      .then((user) => {
        return res.send({
          success: true,
          message: 'User has been removed from blocking list'
        });
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: "Error : " + err.msg
        });
      });
  }
};


/**
 * @api {post} /api/v1/users/editName  7.Edit username
 * @apiVersion 0.1.0
 * @apiName editName
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiParam {String} username body the user content.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *       {
 *         "success": true,
 *         "message": 'Your username is changed successfully.'
 *       }
 */
exports.edit_name = function (req, res) {
  if (!req.body.username) {
    return res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    usersModule.usersQueries.editName({
        user: req.user,
        username: req.body.username
      })
      .then((user) => {
        return res.send(user);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: "Error : " + err.msg
        });
      });
  }
};


/**
 * @api {post} /api/v1/users/editUserState  7.Edit username
 * @apiVersion 0.1.0
 * @apiName editUserState
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiParam {String} user state body the user content.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *       {
 *         "success": true,
 *         "message": 'Your user state is changed successfully.'
 *       }
 */
exports.edit_user_state = function (req, res) {
  if (!req.body.username) {
    return res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    usersModule.usersQueries.editUserState({
        user: req.user._id,
        socketId: req.body.socketId,
        connected: req.body.connected,
        last_seen: req.body.last_seen

      })
      .then((user) => {
        return res.send(user);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: "Error : " + err.msg
        });
      });
  }
};

/**
 * @api {post} /api/v1/users/editImage  8.Edit username
 * @apiVersion 0.1.0
 * @apiName editImage
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiParam {String} username body the user content.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *       {
 *         "success": true,
 *         "message": 'Your image is changed successfully.'
 *       }
 */
exports.edit_image = function (req, res) {
  if (!req.body.image) {
    return res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    usersModule.usersQueries.editImage({
        user: req.user,
        image: req.body.image
      })
      .then((user) => {
        return res.send(user);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: "Error : " + err.msg
        });
      });
  }
};


/**
 * @api {post} /api/v1/users/addStatus 1.Add user Status
 *  @apiVersion 0.1.0
 * @apiName addStatus
 * @apiGroup Status
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiParam {String} newStatus body the status content.
 * @apiParam {String} statusId  the status id.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *       {
 *         "success": true,
 *         "message": 'User Status has been added successfully'
 *       }
 */
exports.add_status = (req, res, next) => {

  if (!req.body.newStatus) {
    return res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    usersModule.usersQueries.addStatus({
        user: req.user,
        status: req.body.newStatus,
        statusId: req.body.statusId
      })
      .then((user) => {
        return res.send({
          success: true,
          message: 'User Status has been added successfully'
        });
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: "Error : " + err.msg
        });
      });
  }

};
/**
 * @api {post} /api/v1/users/deleteStatus 2.Delete user Status
 *  @apiVersion 0.1.0
 * @apiName deleteStatus
 * @apiGroup Status
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiParam {String} statusId  the status id.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *       {
 *         "success": true,
 *         "message": 'User Status has been deleted successfully'
 *       }
 */
exports.delete_status = (req, res, next) => {
  req.checkParams('statusId', 'Invalid status id').isMongoId();
  let errors = req.validationErrors();
  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    usersModule.usersQueries.deleteStatus({
        user: req.user,
        statusId: req.params.statusId
      })
      .then((user) => {
        return res.send({
          success: true,
          message: 'User Status has been deleted successfully'
        });
      })
      .catch((err) => {
       
        
        return res.send({
          success: false,
          message: "Error : " + err
        });
      });
  }

};
/**
 * @api {post} /api/v1/users/deleteAllStatus 3.Delete all user Status
 * @apiVersion 0.1.0
 * @apiName deleteAllStatus
 * @apiGroup Status
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *       {
 *         "success": true,
 *         "message": 'All user Status has been deleted successfully'
 *       }
 */
exports.delete_all_status = (req, res, next) => {

  usersModule.usersQueries.deleteAllStatus({
      user: req.user
    })
    .then((user) => {
      return res.send({
        success: true,
        message: 'All user Status has been deleted successfully'
      });
    })
    .catch((err) => {
      return res.send({
        success: false,
        message: "Error : " + err.msg
      });
    });


};
/**
 * @api {post} /api/v1/users/setCurrentStatus 4.Set current status
 * @apiVersion 0.1.0
 * @apiName setCurrentStatus
 * @apiGroup Status
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiParam {String} statusId  the old status id.
 * @apiParam {String} currentStatusId  the current status id.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'Status has been set as current status successfully'
 *  }
 */
exports.set_current_status = (req, res, next) => {
 
  
  if (!req.body.currentStatusId) {
    return res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    usersModule.usersQueries.setCurrentStatus({
        user: req.user,
        statusId: req.body.statusId,
        currentStatusId: req.body.currentStatusId
      })
      .then((status) => {
        return res.send({
          success: true,
          message: 'Status has been set as current status successfully'
        });
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: "Error : " + err
        });
      });
  }

};


/**
 * @api {get} /api/v1/users/getStatus/:userId  5.Get status list
 * @apiVersion 0.1.0
 * @apiName GetStatus
 * @apiGroup Status
 * @apiPermission UserAuthenticated
 * @apiParam {String} userId Put the user ID to get information .
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * [
    {
        "_id": "59efb0f8e5c51c09193eeaef",
        "userId": "59efb0f8e5c51c09193eeaee",
        "created": "2017-10-24T21:30:32.802Z",
        "current": false,
        "body": "Only Emergency calls"
    },
    {
        "_id": "59efb0f8e5c51c09193eeaf0",
        "userId": "59efb0f8e5c51c09193eeaee",
        "created": "2017-10-24T21:30:32.803Z",
        "current": false,
        "body": "Busy"
    },
    {
        "_id": "59efb0f8e5c51c09193eeaf1",
        "userId": "59efb0f8e5c51c09193eeaee",
        "created": "2017-10-24T21:30:32.803Z",
        "current": false,
        "body": "At work"
    },
    {
        "_id": "59efb0f8e5c51c09193eeaf2",
        "userId": "59efb0f8e5c51c09193eeaee",
        "created": "2017-10-24T21:30:32.804Z",
        "current": true,
        "body": "in a meeting"
    },
    {
        "_id": "59efb0f8e5c51c09193eeaf3",
        "userId": "59efb0f8e5c51c09193eeaee",
        "created": "2017-10-24T21:30:32.804Z",
        "current": false,
        "body": "Available"
    },
    {
        "_id": "59efb0f8e5c51c09193eeaf4",
        "userId": "59efb0f8e5c51c09193eeaee",
        "created": "2017-10-24T21:30:32.804Z",
        "current": false,
        "body": "Playing football"
    },
    {
        "_id": "59efb0f8e5c51c09193eeaf5",
        "userId": "59efb0f8e5c51c09193eeaee",
        "created": "2017-10-24T21:30:32.804Z",
        "current": false,
        "body": "Hey i am using whatsclone enjoy it"
    }
]*/
exports.get_status = (req, res, next) => {
  req.checkParams('userId', 'The user ID is an invalid hex-encoded representation of a MongoDB ObjectId.').isMongoId();

  let errors = req.validationErrors();

  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    let userId = req.params.userId;
    usersModule.usersQueries.getStatus(userId)
      .then((status) => {
        
        return res.send(status);
      })
      .catch((err) => {
        return res.send({
          success: false,
          message: "Error : " + err.message
        });
      });

    /*  success: false,
      message: 'Oops! some params are missing.' //err.message
      */
  }
};





/**
 * @api {get} /api/v1/users/getAppSettings 9.Get application settings
 * @apiVersion 0.1.0
 * @apiName geAppSettings
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 *{
    "adsVideoStatus": true,
    "adsBannerStatus": true,
    "adsInterstitialStatus": true,
    "unitBannerID": "put your unit id of admob",
    "unitVideoID": "put your Video unit id of admob",
    "unitInterstitialID": "put your Interstitial unit id of admob",
    "giphyKey": "put your giphy key here",
    "privacyLink": "https://strolink.com/privacy_link",
    "appID": "put your Video app id of admob",
    "publisherId": "here your admob publisher  id ",
    "appVersion": "21"
}
 */
exports.get_app_settings = function (req, res) {

  usersModule.usersQueries.getSettings()
    .then((settings) => {
      var setting = {
        adsVideoStatus: settings.video_ads_status == 'on' ? true : false,
        adsBannerStatus: settings.banner_ads_status == 'on' ? true : false,
        adsInterstitialStatus: settings.interstitial_ads_status == 'on' ? true : false,
        unitBannerID: settings.banner_ads_unit_id,
        unitVideoID: settings.video_ads_unit_id,
        unitInterstitialID: settings.interstitial_ads_unit_id,
        giphyKey: settings.giphy_key,
        privacyLink: settings.privacy_link,
        appID: settings.video_ads_app_id,
        publisherId: settings.publisher_id,
        appVersion: settings.app_version
      }

      return res.send(setting);
    })
    .catch((err) => {
      return res.send({
        success: false,
        message: "Error : " + err.message
      });
    });
};




/**
 * @api {post} /api/v1/users/saveNewCall 10.Save the new call
 * @apiVersion 0.1.0
 * @apiName saveNewCall
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiParam {String} fromId  the sender user id.
 * @apiParam {String} toId  the recipient user id.
 * @apiParam {String} date  the date of call.
 * @apiParam {String} duration  the duration of call.
 * @apiParam {String} isVideo  call is video or audio.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'Call has been saved successfully'
 *  }
 */
exports.save_new_call = (req, res, next) => {

  if (!req.body.fromId || !req.body.toId || !req.body.date || !req.body.duration || !req.body.isVideo) {
    return res.send({
      success: false,
      message: 'Oops! some params are missing. '
    });
  } else {
    usersModule.usersQueries.saveNewCall({
        user: req.user,
        body: req.body
      })
      .then((status) => {

        return res.send(status);
      })
      .catch((err) => {

        return res.send({
          success: false,
          message: "Error : " + err.msg,
          callId: null
        });
      });
  }

};



/**
 * @api {post} /api/v1/users/createStory 1.Create new story
 * @apiVersion 0.1.0
 * @apiName createStory
 * @apiGroup Story
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {String} message The response message.
 * @apiParam {String} fromId  the sender user id.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Success-Response:
 * {
 *  success: true,
 *  message: 'Story has been saved successfully',
 *  storyId : '5c100d46c0c2ef0852b54505'
 *  }
 */

exports.create_story = (req, res, next) => {
  usersModule.usersQueries.createStory({
      user: req.user,
      body: req.body
    })
    .then((message) => {
      return res.send(message);
    })
    .catch((err) => {
      return res.send(err);
    });
};


/**
  * @api {post} /api/v1/users/deleteStory/:storyId 2.delete user story
  * @apiVersion 0.1.0
  * @apiName deleteStory
  * @apiGroup Story
  * @apiPermission UserAuthenticated
  * @apiSuccess {Boolean} success Response Status.
  * @apiSuccess {Object}  message The response message.
  * @apiHeaderExample {String} Header-Example:
  * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
  * @apiSuccessExample {json} Response-Example:
 {
    "success": true,
    "message": "the story is deleted successfully"
}
 */
exports.delete_story = (req, res, next) => {
  req.checkParams('storyId', 'The sotry ID is an invalid hex-encoded representation of a MongoDB ObjectId.').isMongoId();
  let errors = req.validationErrors();

  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    usersModule.usersQueries.deleteStory({
        user: req.user,
        storyId: req.params.storyId
      })
      .then((story) => {
        return res.send(story);
      })
      .catch((err) => {
        return res.send(err);
      });
  }
};