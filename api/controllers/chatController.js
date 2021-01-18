/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:48:01 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-05-18 22:57:53
 */

'use strict';

const chatsModule = require('../routes/app-modules/app-chat');



/**
  * @api {post} /api/v1/chats/sendMessage 1.Send user message
  * @apiVersion 0.1.0
  * @apiName sendUserMessage
  * @apiGroup Chat
  * @apiPermission UserAuthenticated
  * @apiSuccess {Boolean} success Response Status.
  * @apiSuccess {Object}  message The response message.
  * @apiHeaderExample {String} Header-Example:
  * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
  * @apiSuccessExample {json} Response-Example:
 {
    "success": true,
    "message": {
        "sender": {
            "_id": "59ecfe89a79ccb0a5b991d6c",
            "image": null,
            "phone": "+212666717200",
            "username": null
        },
        "recipient": {
            "_id": "59efb0f8e5c51c09193eeaee",
            "image": null,
            "phone": "+212633909683",
            "username": "Bencherif"
        },
        "_id": "59f3aa42dafa731d3cd5488c",
        "created": "2017-10-27T21:50:58.218Z",
        "duration_file": null,
        "file_size": null,
        "document_file": null,
        "audio_file": null,
        "thumbnail_file": null,
        "video_file": null,
        "image_file": null,
        "message": "how are you",
        "status": 1,
        "isFileUpload": true,
        "isFileDownLoad": true,
        "deleted": false
    }
}
 */
exports.send_message = (req, res, next) => {
  /*req.checkParams('otherUserId', 'The user ID is an invalid hex-encoded representation of a MongoDB ObjectId.').isMongoId();
  let errors = req.validationErrors();

  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {*/
  chatsModule.chatQueries.sendMessage({
      user: req.user,
      //  otherUserId: req.params.otherUserId,
      body: req.body
    })
    .then((message) => {
      return res.send(message);
    })
    .catch((err) => {
      return res.send(err);
    });
  //}
};

/**
 * @api {post} /api/v1/chat/sendGroupMessage 2.Send group message
 * @apiVersion 0.1.0
 * @apiName sendGroupMessage
 * @apiGroup Chat
 * @apiPermission UserAuthenticated
 * @apiSuccess {Boolean} success Response Status.
 * @apiSuccess {Object}  message The response message.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccessExample {json} Response-Example:
 {
    "success": true,
    "message": {
        "sender": {
            "_id": "59efb0f8e5c51c09193eeaee",
            "image": null,
            "phone": "+212633909683",
            "username": "Bencherif"
        },
        "_id": "59f3aa9ddafa731d3cd5488d",
        "created": "2017-10-27T21:52:29.590Z",
        "duration_file": null,
        "file_size": null,
        "document_file": null,
        "audio_file": null,
        "thumbnail_file": null,
        "video_file": null,
        "image_file": null,
        "message": "good job benten",
        "status": 1,
        "group": {
            "_id": "59f1f3e67ee1ac07188852fb",
            "image": "jjajdjajad",
            "name": "bencherif"
        },
        "isFileUpload": true,
        "isFileDownLoad": true,
        "deleted": false
    }
}
 */

/**
   * @api {get} /api/v1/chat/all  3.Get  conversations list
   * @apiVersion 0.1.0
   * @apiName getAllConversations
   * @apiGroup Chat
   * @apiPermission UserAuthenticated
   * @apiSuccess {Boolean} success Response Status.
   * @apiSuccess {Object}  conversations The response message.
   * @apiHeaderExample {String} Header-Example:
   * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
   * @apiSuccessExample {json} Response-Example:
 [
        {
            "_id": "59f391696d2784148be8e153",
            "created": "2017-10-27T20:04:57.595Z",
            "group": {
                "_id": "59f1f3e67ee1ac07188852fb",
                "created": "2017-10-26T14:40:38.349Z",
                "image": "jjajdjajad",
                "name": "bencherif"
            },
            "latestMessage": {
                "sender": {
                    "_id": "59efb0f8e5c51c09193eeaee",
                    "status": {
                        "_id": "59efb0f8e5c51c09193eeaf1",
                        "userId": "59efb0f8e5c51c09193eeaee",
                        "created": "2017-10-24T21:30:32.803Z",
                        "current": true,
                        "body": "At work"
                    },
                    "backup_hash": null,
                    "has_backup": false,
                    "activated": true,
                    "image": null,
                    "phone": "+212633909681",
                    "username": " bencherif",
                    "linked": true
                },
                "_id": "59f4f290576eb80cb3c40f2c",
                "created": "2017-10-28T21:11:44.079Z",
                "duration_file": null,
                "file_size": null,
                "file_type": null,
                "file": null,
                "message": "good job benten mohamed hhh nroo",
                "status": 1,
                "group": {
                    "_id": "59f1f3e67ee1ac07188852fb",
                    "created": "2017-10-26T14:40:38.349Z",
                    "image": "jjajdjajad",
                    "name": "bencherif"
                },
                "file_upload": true,
                "file_downLoad": true,
                "conversationId": "59f391696d2784148be8e153"
            },
            "status": 1
        },
        {
            "_id": "59f385e7f94e5811499a8df4",
            "created": "2017-10-27T19:15:51.793Z",
            "owner": {
                "_id": "59ecfe89a79ccb0a5b991d6c",
                "image": null,
                "phone": "+212670022191",
                "username": null
            },
            "latestMessage": {
                "sender": {
                    "_id": "59efb0f8e5c51c09193eeaee",
                    "status": {
                        "_id": "59efb0f8e5c51c09193eeaf1",
                        "userId": "59efb0f8e5c51c09193eeaee",
                        "created": "2017-10-24T21:30:32.803Z",
                        "current": true,
                        "body": "At work"
                    },
                    "backup_hash": null,
                    "has_backup": false,
                    "activated": true,
                    "image": null,
                    "phone": "+212633909681",
                    "username": " bencherif",
                    "linked": true
                },
                "recipient": {
                    "_id": "59ecfe89a79ccb0a5b991d6c",
                    "status": {
                        "_id": "59efb0f8e5c51c09193eeaf2",
                        "userId": "59ecfe89a79ccb0a5b991d6c",
                        "created": "2017-10-24T21:30:32.804Z",
                        "current": true,
                        "body": "in a meeting"
                    },
                    "backup_hash": null,
                    "has_backup": false,
                    "activated": true,
                    "image": null,
                    "phone": "+212670022191",
                    "username": null,
                    "linked": true
                },
                "_id": "59ffa8732855e10ec4013801",
                "created": "2017-11-06T00:10:23.982Z",
                "duration_file": "0",
                "file_size": "0",
                "file_type": null,
                "file": null,
                "message": "fhjg",
                "status": 1,
                "file_upload": true,
                "file_downLoad": true,
                "conversationId": "59f385e7f94e5811499a8df4"
            },
            "status": 1
        }
    ]

 */
exports.get_conversations = (req, res, next) => {
  chatsModule.chatQueries.getConversations({
      user: req.user
    })
    .then((conversations) => {
      return res.send(conversations);
    })
    .catch((err) => {
      return res.send({
        success: false,
        message: " " + err
      });
    });
};

/**
  * @api {get} /api/v1/chat/getSingleConversation/otherUserId 4.Get single user conversation
  * @apiVersion 0.1.0
  * @apiName getSingleUserConversation
  * @apiGroup Chat
  * @apiPermission UserAuthenticated
  * @apiSuccess {Boolean} success Response Status.
  * @apiSuccess {Object}  message The response message.
  * @apiHeaderExample {String} Header-Example:
  * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
  * @apiSuccessExample {json} Response-Example:
  *
  [
        {
            "sender": {
                "_id": "59efb0f8e5c51c09193eeaee",
                "image": null,
                "phone": "+212633909681",
                "username": " bencherif"
            },
            "recipient": {
                "_id": "59ecfe89a79ccb0a5b991d6c",
                "image": null,
                "phone": "+212670022191",
                "username": null
            },
            "_id": "59f385e7f94e5811499a8df5",
            "created": "2017-10-27T19:15:51.799Z",
            "duration_file": null,
            "file_size": null,
            "file_type": null,
            "file": null,
            "message": "this is a new message from bencherif to server  nop",
            "status": 0,
            "file_upload": true,
            "file_downLoad": true,
            "conversationId": "59f385e7f94e5811499a8df4"
        },
        {
            "sender": {
                "_id": "59efb0f8e5c51c09193eeaee",
                "image": null,
                "phone": "+212633909681",
                "username": " bencherif"
            },
            "recipient": {
                "_id": "59ecfe89a79ccb0a5b991d6c",
                "image": null,
                "phone": "+212670022191",
                "username": null
            },
            "_id": "59f385f6f94e5811499a8df6",
            "created": "2017-10-27T19:16:06.420Z",
            "duration_file": null,
            "file_size": null,
            "file_type": null,
            "file": null,
            "message": "this a second messages",
            "status": 0,
            "file_upload": true,
            "file_downLoad": true,
            "conversationId": "59f385e7f94e5811499a8df4"
        },
        {
            "sender": {
                "_id": "59efb0f8e5c51c09193eeaee",
                "image": null,
                "phone": "+212633909681",
                "username": " bencherif"
            },
            "recipient": {
                "_id": "59ecfe89a79ccb0a5b991d6c",
                "image": null,
                "phone": "+212670022191",
                "username": null
            },
            "_id": "59f385fdf94e5811499a8df7",
            "created": "2017-10-27T19:16:13.310Z",
            "duration_file": null,
            "file_size": null,
            "file_type": null,
            "file": null,
            "message": "this a third messages",
            "status": 0,
            "file_upload": true,
            "file_downLoad": true,
            "conversationId": "59f385e7f94e5811499a8df4"
        },
        {
            "sender": {
                "_id": "59efb0f8e5c51c09193eeaee",
                "image": null,
                "phone": "+212633909681",
                "username": " bencherif"
            },
            "recipient": {
                "_id": "59ecfe89a79ccb0a5b991d6c",
                "image": null,
                "phone": "+212670022191",
                "username": null
            },
            "_id": "59f38603f94e5811499a8df8",
            "created": "2017-10-27T19:16:19.914Z",
            "duration_file": null,
            "file_size": null,
            "file_type": null,
            "file": null,
            "message": "inakl forever",
            "status": 0,
            "file_upload": true,
            "file_downLoad": true,
            "conversationId": "59f385e7f94e5811499a8df4"
        },
        {
            "sender": {
                "_id": "59ecfe89a79ccb0a5b991d6c",
                "image": null,
                "phone": "+212670022191",
                "username": null
            },
            "recipient": {
                "_id": "59efb0f8e5c51c09193eeaee",
                "image": null,
                "phone": "+212633909681",
                "username": " bencherif"
            },
            "_id": "59f38619f94e5811499a8df9",
            "created": "2017-10-27T19:16:41.399Z",
            "duration_file": null,
            "file_size": null,
            "file_type": null,
            "file": null,
            "message": "this is a new message from bencherif to server  nop",
            "status": 0,
            "file_upload": true,
            "file_downLoad": true,
            "conversationId": "59f385e7f94e5811499a8df4"
        },
        {
            "sender": {
                "_id": "59ecfe89a79ccb0a5b991d6c",
                "image": null,
                "phone": "+212670022191",
                "username": null
            },
            "recipient": {
                "_id": "59efb0f8e5c51c09193eeaee",
                "image": null,
                "phone": "+212633909681",
                "username": " bencherif"
            },
            "_id": "59f3861ff94e5811499a8dfa",
            "created": "2017-10-27T19:16:47.327Z",
            "duration_file": null,
            "file_size": null,
            "file_type": null,
            "file": null,
            "message": "hi",
            "status": 0,
            "file_upload": true,
            "file_downLoad": true,
            "conversationId": "59f385e7f94e5811499a8df4"
        }
      ]

*/
exports.get_single_conversation = (req, res, next) => {
  req.checkParams('otherUserId', 'The user ID is an invalid hex-encoded representation of a MongoDB ObjectId.').isMongoId();
  let errors = req.validationErrors();

  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    chatsModule.chatQueries.getSingleConversation({
        user: req.user,
        otherUserId: req.params.otherUserId
      })
      .then((messages) => {
        return res.send(messages);
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
  * @api {get} /api/v1/chat/getSingleGroupConversation/groupId 5.Get single group conversation
  * @apiVersion 0.1.0
  * @apiName getSingleGroupConversation
  * @apiGroup Chat
  * @apiPermission UserAuthenticated
  * @apiSuccess {Boolean} success Response Status.
  * @apiSuccess {Object}  message The response message.
  * @apiHeaderExample {String} Header-Example:
  * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
  * @apiSuccessExample {json} Response-Example:
  *  [
       {
           "sender": {
               "_id": "59ecfe89a79ccb0a5b991d6c",
               "image": null,
               "phone": "+212666717200",
               "username": null
           },
           "_id": "59f391696d2784148be8e154",
           "created": "2017-10-27T20:04:57.598Z",
           "duration_file": null,
           "file_size": null,
           "document_file": null,
           "audio_file": null,
           "thumbnail_file": null,
           "video_file": null,
           "image_file": null,
           "message": "this a second hhhhh",
           "status": 0,
           "group": {
               "_id": "59f1f3e67ee1ac07188852fb",
               "image": "jjajdjajad",
               "name": "bencherif"
           },
           "isFileUpload": true,
           "isFileDownLoad": true,
           "deleted": false
       },
       {
           "sender": {
               "_id": "59ecfe89a79ccb0a5b991d6c",
               "image": null,
               "phone": "+212666717200",
               "username": null
           },
           "_id": "59f39a859bfca6187a713e70",
           "created": "2017-10-27T20:43:49.856Z",
           "duration_file": null,
           "file_size": null,
           "document_file": null,
           "audio_file": null,
           "thumbnail_file": null,
           "video_file": null,
           "image_file": null,
           "message": "this a second hhhhh",
           "status": 0,
           "group": {
               "_id": "59f1f3e67ee1ac07188852fb",
               "image": "jjajdjajad",
               "name": "bencherif"
           },
           "isFileUpload": true,
           "isFileDownLoad": true,
           "deleted": false
       }
     ]

*/
exports.get_single_group_conversation = (req, res, next) => {
  req.checkParams('groupId', 'The group ID is an invalid hex-encoded representation of a MongoDB ObjectId.').isMongoId();
  let errors = req.validationErrors();

  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    chatsModule.chatQueries.getSingleGroupConversation({
        user: req.user,
        groupId: req.params.groupId
      })
      .then((messages) => {
        return res.send(messages);
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
  * @api {post} /api/v1/chats/deleteMessage 6.delete user message
  * @apiVersion 0.1.0
  * @apiName deleteMessage
  * @apiGroup Chat
  * @apiPermission UserAuthenticated
  * @apiSuccess {Boolean} success Response Status.
  * @apiSuccess {Object}  message The response message.
  * @apiHeaderExample {String} Header-Example:
  * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
  * @apiSuccessExample {json} Response-Example:
 {
    "success": true,
    "message": "the message is deleted successfully"
}
 */
exports.delete_message = (req, res, next) => {
  req.checkParams('messageId', 'The message ID is an invalid hex-encoded representation of a MongoDB ObjectId.').isMongoId();
  let errors = req.validationErrors();

  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    chatsModule.chatQueries.deleteMessage({
        user: req.user,
        messageId: req.params.messageId
      })
      .then((message) => {
        return res.send(message);
      })
      .catch((err) => {
        return res.send(err);
      });
  }
};


/**
  * @api {post} /api/v1/chats/deleteConversation 7.delete user conversation
  * @apiVersion 0.1.0
  * @apiName deleteConversation
  * @apiGroup Chat
  * @apiPermission UserAuthenticated
  * @apiSuccess {Boolean} success Response Status.
  * @apiSuccess {Object}  message The response message.
  * @apiHeaderExample {String} Header-Example:
  * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
  * @apiSuccessExample {json} Response-Example:
 {
    "success": true,
    "message": "the conversation is deleted successfully"
}
 */
exports.delete_conversation = (req, res, next) => {
  req.checkParams('conversationId', 'The conversation ID is an invalid hex-encoded representation of a MongoDB ObjectId.').isMongoId();
  let errors = req.validationErrors();

  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    chatsModule.chatQueries.deleteConversation({
        user: req.user,
        conversationId: req.params.conversationId
      })
      .then((message) => {
        return res.send(message);
      })
      .catch((err) => {
        return res.send(err);
      });
  }
};