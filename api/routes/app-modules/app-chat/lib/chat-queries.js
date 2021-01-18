/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:51:36 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-12-31 23:36:17
 */

'use strict';


const chatSchema = require('../../../../models/chats');
const userSchema = require('../../../../models/users');
const _ = require('underscore');
const eventAction = require('../../app-event-listener');
var mongo = require('mongodb'),
  ObjectID = mongo.ObjectID;

/** @module AppChat/ChatQueries */
module.exports = (function () {



  /**
   * @name _getConversations
   * @function
   * @desc get list of conversations
   * @param {object} options conversations options
   * @return {array} the function return array
   */
  let _getConversations = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      chatSchema.find({
        users: options.user._id
      }).populate({
        path: 'groupId',
        select: 'name image created'
      }).populate({
        path: 'users',
        select: 'username phone image',
        match: {
          _id: {
            $ne: options.user._id
          }
        }
      }).populate({
        path: 'messages.sender',
        select: 'username phone image activated status'
      }).populate({
        path: 'messages.recipient',
        select: 'username phone image activated status '
      }).populate({
        path: 'messages.groupId',
        select: 'name image members created'
      }).select('-__v').sort({
        created: -1
      }).exec((err, conversations) => {
        if (err) {
          reject(new Error('Failed getting conversations ' + err));
          return callback(new Error('Failed getting conversations ' + err));
        }
        let conversations1 = [];
        conversations.map((conversation) => {
          let item = conversation.toObject();
          item.owner = conversation.users[0];
          item.group = conversation.groupId;

          let messages = [];
          conversation.messages.map((message) => {
            let item = message.toObject();

            item.group = item.groupId;
            item.conversationId = conversation._id;
            if (item.group) {

              /*    let members = [];
                  item.group.members.map((itemMember) => {

                    if (itemMember.userId == options.user._id) {

                      delete itemMember.userId;
                      delete itemMember.groupId;
                      delete itemMember.admin;
                      delete itemMember.left;
                      delete itemMember._id;
                      members.push(itemMember);
                    }
                  });

                  item.deleted = members[0].deleted;*/

              item.is_group = true;
              delete item.groupId;
              //delete item.group.members;
            } else {
              let status_recipient = [];
              item.recipient.status.map((status_r) => {
                if (status_r.current == true) {
                  status_recipient.push(status_r);
                }
              });
              item.recipient.status = status_recipient[0];
              item.recipient.linked = true;

              item.is_group = false;

            }
            let deleted_users = [];
            item.deleted.map((is_deleted) => {

              deleted_users.push(is_deleted);

            });

            item.deleted = false;
            _.forEach(deleted_users, (user_id) => {

              if (user_id.equals(options.user._id)) {
                item.deleted = true;
                return true;
              }

            });

            let status_sender = [];
            item.sender.status.map((status_s) => {

              if (status_s.current == true) {
                status_sender.push(status_s);
              }
            });
            item.sender.status = status_sender[0];
            item.sender.linked = true;

            if (item.deleted == false) {
              messages.push(item);
            }
          });
          item.messages = messages;
          item.latestMessage = messages[messages.length - 1];

          if (item.latestMessage.sent.length > 0) {
            item.status = 1;
          } else if (item.latestMessage.delivered.length > 0) {
            item.status = 2;
          } else if (item.latestMessage.seen.length > 0) {
            item.status = 3;
          }
          if (item.group) {
            delete item.owner;
            delete item.groupId;
            item.is_group = true;
          } else {

            item.is_group = false;
          }
          delete item.deleted;
          delete item.users;
          delete item.messages;
          if (item.latestMessage.deleted == false) {
            delete item.latestMessage.deleted;
            conversations1.push(item);
          }
        });
        resolve(conversations1);
        return callback(null, conversations1);
      });
    });
  };

  /**
   * @name _getSingleConversation
   * @function
   * @desc get a single conversations messages
   * @param {object} options conversations options
   * @return {array} the function return array
   */
  let _getSingleConversation = (options, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {
      chatSchema.findOne({
          $and: [{
            users: options.userId
          }]
        })
        .populate({
          path: 'messages.sender',
          select: 'username phone image activated status'
        }).populate({
          path: 'messages.recipient',
          select: 'username phone image activated status'
        }).exec((err, conversation) => {
          if (err || !conversation) {
            reject(new Error('failed loading conversation ' + err));
            return callback(new Error('failed loading conversation ' + err));
          }

          let messages = [];
          conversation.messages.map((message) => {
            let item = message.toObject();
            item.conversationId = conversation._id;
            let deleted_users = [];
            item.deleted.map((is_deleted) => {
              deleted_users.push(is_deleted);
            });
            item.deleted = false;
            _.forEach(deleted_users, (user_id) => {
              if (user_id.equals(options.userId)) {
                item.deleted = true;
                return true;
              }
            });
            item.recipient.linked = true;
            let status_recipient = [];
            item.recipient.status.map((status_r) => {
              if (status_r.current == true) {
                status_recipient.push(status_r);
              }
            });
            item.recipient.status = status_recipient[0];

            item.sender.linked = true;
            let status_sender = [];
            item.sender.status.map((status_s) => {

              if (status_s.current == true) {
                status_sender.push(status_s);
              }
            });
            item.sender.status = status_sender[0];
            if (item.deleted == false && item.status == 1 && item.recipient._id == options.userId) {
              delete item.deleted;
              messages.push(item);
            }

          });

          resolve(messages);
          return callback(null, messages);
        });
    });
  };

  /**
   * @name _getSingleMessage
   * @function
   * @desc get a single  message
   * @param {object} options conversations options
   * @return {object} the function return response
   */
  let _getSingleMessage = (options, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {
      chatSchema.findOne({
          $and: [{
            users: options.user._id
          }, {
            users: options.otherUserId
          }]
        })
        //.select('messages')
        .populate({
          path: 'messages.sender',
          select: 'username phone image'
        }).populate({
          path: 'messages.recipient',
          select: 'username phone image'
        }).exec((err, conversation) => {
          if (err || !conversation) {
            reject(new Error('failed loading conversation'));
            return callback(new Error('failed loading conversation'));
          }

          let message = conversation.messages[conversation.messages.length - 1];

          let item = message.toObject();
          if (item.s_deleted.userId == options.user._id) {
            item.deleted = item.s_deleted.deleted;
          } else if (item.r_deleted.userId == options.user._id) {
            item.deleted = item.r_deleted.deleted;
          }

          item.is_group = false;
          if (item.deleted == false) {
            delete item.deleted;
            delete item.s_deleted;
            delete item.r_deleted;
          }

          resolve(item);
          return callback(null, item);
        });
    });
  };

  /**
   * @name _getSingleGroupConversation
   * @function
   * @desc get a single group conversations messages
   * @param {object} options conversations options
   * @return {array} the function return array
   */
  let _getSingleGroupConversation = (options, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {
      chatSchema.findOne({
          groupId: options.groupId
        })
        //.select('messages')
        .populate({
          path: 'messages.sender',
          select: 'username phone image'
        }).populate({
          path: 'messages.groupId',
          select: 'name image members'
        }).exec((err, conversation) => {
          if (err || !conversation) {
            reject(new Error('failed loading conversation'));
            return callback(new Error('failed loading conversation'));
          }

          let messages = [];
          conversation.messages.map((message) => {
            let item = message.toObject();
            item.group = item.groupId;


            item.conversationId = conversation._id;
            if (item.group) {
              let members = [];
              item.group.members.map((itemMember) => {
                if (itemMember.userId == options.user._id) {
                  delete itemMember.userId;
                  delete itemMember.groupId;
                  delete itemMember.admin;
                  delete itemMember.left;
                  delete itemMember._id;
                  members.push(itemMember);
                }
              });

              item.deleted = members[0].deleted;

              delete item.groupId;
              delete item.group.members;
            }


            item.is_group = true;
            if (item.deleted == false) {
              delete item.deleted;
              delete item.s_deleted;
              delete item.r_deleted;
              messages.push(item);
            }

          });

          resolve(messages);
          return callback(null, messages);
        });
    });
  };

  /**
   * @name _getSingleGroupMessage
   * @function
   * @desc get a single group message
   * @param {object} options conversations options
   * @return {object} the function return response
   */
  let _getSingleGroupMessage = (options, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {
      chatSchema.findOne({
          groupId: options.groupId
        })

        .populate({
          path: 'messages.sender',
          select: 'username phone image'
        }).populate({
          path: 'messages.groupId',
          select: 'name image '
        }).exec((err, conversation) => {
          if (err || !conversation) {
            reject(new Error('failed loading conversation'));
            return callback(new Error('failed loading conversation'));
          }

          let message = conversation.messages[conversation.messages.length - 1];
          let item = message.toObject();
          item.group = item.groupId;
          delete item.s_deleted;
          delete item.r_deleted;

          resolve(item);
          return callback(null, item);
        });
    });
  };


  /**
   * @name _sendMessage
   * @function
   * @desc send message to user
   * @param {object} options  user options
   * @return {object} the function return message object
   */
  let _sendMessage = (options, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {
      if (options.body.groupId) {


        chatSchema.findOne({
            groupId: options.body.groupId
          })
          .select('messages')
          .exec((err, conversation) => {
            if (err) {
              reject(new Error('Oops something went wrong'));
              return callback(new Error('Oops something went wrong'));
            }
            let message = {
              sender: options.user._id,
              groupId: options.body.groupId
            };
            if (!options.body.message && !options.body.file && !options.body.longitude) {
              reject(new Error('You can\'t send an empty message'));
              return callback(new Error('You can\'t send an empty message'));
            }

            if (options.body.message) {
              message.message = options.body.message;
            }
            if (options.body.created) {
              message.created = options.body.created;
            }

            if (options.body.file) {
              message.file = options.body.file;
            }
            if (options.body.file_type) {
              message.file_type = options.body.file_type;
            }
            if (options.body.file_size) {
              message.file_size = options.body.file_size;
            }
            if (options.body.duration_file) {
              message.duration_file = options.body.duration_file;
            }
            if (options.body.state) {
              message.state = options.body.state;
            }

            if (options.body.longitude) {
              message.longitude = options.body.longitude;
            }
            if (options.body.latitude) {
              message.latitude = options.body.latitude;
            }

            if (options.body.reply_id) {
              //  if (options.body.reply_id != "null") {
              message.reply_id = options.body.reply_id;
              //  }
            }
            if (options.body.reply_message != null) {
              message.reply_message = options.body.reply_message;
            }

            if (options.body.document_type) {
              message.document_type = options.body.document_type;
            }

            if (options.body.document_name) {
              message.document_name = options.body.document_name;
            }

            message.sent = options.body.members_ids


            if (!conversation) {

              let newChatSchema = new chatSchema({
                users: [options.user._id],
                groupId: options.body.groupId,
                messages: [message]

              });

              newChatSchema.save((err, conversationInserted) => {
                if (err) {
                  var messageData = {
                    success: false,
                    message: 'Couldn\'t save your message please try again later',
                    messageId: null,
                    conversationId: null
                  }
                  reject(messageData);
                  return callback(messageData);
                }

                var messageData = {
                  success: true,
                  message: 'The group message is sent successfully.',
                  messageId: conversationInserted.messages[conversationInserted.messages.length - 1]._id,
                  conversationId: conversationInserted._id
                }
                resolve(messageData);
                return callback(null, messageData);


              });
            } else {
              conversation.messages.push(message);
              conversation.save((err, conversationInserted) => {
                if (err) {
                  var messageData = {
                    success: false,
                    message: 'Couldn\'t save your message please try again later',
                    messageId: null,
                    conversationId: null
                  }
                  reject(messageData);
                  return callback(messageData);
                }

                var messageData = {
                  success: true,
                  message: 'The group message is sent successfully.',
                  messageId: conversationInserted.messages[conversationInserted.messages.length - 1]._id,
                  conversationId: conversationInserted._id
                }
                resolve(messageData);
                return callback(null, messageData);




              });
            }
          });
      } else {
        if (options.user._id === options.body.otherUserId) {
          reject(new Error('You can\'t send message to yourself'));
          return callback(new Error('You can\'t send message to yourself'));
        } else {
          chatSchema.findOne({
              $and: [{
                users: options.user._id
              }, {
                users: options.body.otherUserId
              }]
            })
            .select('messages')
            .exec((err, conversation) => {
              if (err) {
                reject(new Error('Oops something went wrong'));
                return callback(new Error('Oops something went wrong'));
              }
              let message = {
                sender: options.user._id,
                recipient: options.body.otherUserId
              };
              if (!options.body.message && !options.body.file) {
                reject(new Error('You can\'t send an empty message'));
                return callback(new Error('You can\'t send an empty message'));
              }
              if (options.body.message) {
                message.message = options.body.message;
              }
              if (options.body.created) {
                message.created = options.body.created;
              }

              if (options.body.file) {
                message.file = options.body.file;
              }
              if (options.body.file_type) {
                message.file_type = options.body.file_type;
              }
              if (options.body.file_size) {
                message.file_size = options.body.file_size;
              }
              if (options.body.duration_file) {
                message.duration_file = options.body.duration_file;
              }

              if (options.body.state) {
                message.state = options.body.state;
              }

              if (options.body.longitude) {
                message.longitude = options.body.longitude;
              }
              if (options.body.latitude) {
                message.latitude = options.body.latitude;
              }


              if (options.body.reply_id) {
                //    if (options.body.reply_id != "null") {
                message.reply_id = options.body.reply_id;
                //    }
              }
              if (options.body.reply_message != null) {
                message.reply_message = options.body.reply_message;
              }

              if (options.body.document_type) {
                message.document_type = options.body.document_type;
              }

              if (options.body.document_name) {
                message.document_name = options.body.document_name;
              }

              //message.sent.push(options.body.otherUserId);
              message.sent = [options.body.otherUserId]
              if (!conversation) {
                let newChatSchema = new chatSchema({
                  users: [options.user._id, options.body.otherUserId],
                  messages: [message]

                });

                newChatSchema.save((err, conversationInserted) => {
                  if (err) {
                    var messageData = {
                      success: false,
                      message: 'Couldn\'t save your message please try again later',
                      messageId: null,
                      conversationId: null
                    }
                    reject(messageData);
                    return callback(messageData);
                  }

                  var messageData = {
                    success: true,
                    message: 'The message is sent successfully.',
                    messageId: conversationInserted.messages[conversationInserted.messages.length - 1]._id,
                    conversationId: conversationInserted._id
                  }

                  resolve(messageData);
                  return callback(null, messageData);



                });
              } else {
                conversation.messages.push(message);
                conversation.save((err, conversationInserted) => {
                  if (err) {
                    var messageData = {
                      success: false,
                      message: 'Couldn\'t save your message please try again later',
                      messageId: null,
                      conversationId: null
                    }
                    reject(messageData);
                    return callback(messageData);
                  }

                  var messageData = {
                    success: true,
                    message: 'The message is sent successfully.',
                    messageId: conversationInserted.messages[conversationInserted.messages.length - 1]._id,
                    conversationId: conversationInserted._id
                  }

                  resolve(messageData);
                  return callback(null, messageData);



                });
              }
            });
        }
      }



    });
  };



  /**
   * @name _makeMessageExistAsFinished
   * @function
   * @desc set a messages as finished if is removed by sender
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeMessageExistAsFinished = (options, callback) => {
    callback = callback || function () {};

    let messageId = options.messageId;
    let userId = options.userId;
    let query = {
      'messages._id': messageId
    };
    return new Promise((resolve, reject) => {

      chatSchema.updateOne(query, {
        $set: {
          "messages.$[elem].sent": []
        },
        $set: {
          "messages.$[elem].delivered": []
        },
        $set: {
          "messages.$[elem].seen": []

        }
      }, {
        multi: true,
        arrayFilters: [{
          "elem._id": {
            $eq: messageId
          }
        }]
      }).exec((err, message) => {
        if (err) {
          let response = {
            success: false,
            message: err.message
          }

          reject(response);
          return callback(response);
        }
        let response = {
          success: true,
          message: 'You made the message as exist finished successfully.'
        }

        resolve(response);
        return callback(null, response);
      });

    });
  }; 

  /**
   * @name _makeMessageAsFinished
   * @function
   * @desc set a messages as finished
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeMessageAsFinished = (options, callback) => {
    callback = callback || function () {};

    let messageId = options.messageId;
    let userId = options.userId;
    let query = {
      'messages._id': messageId
    };
    return new Promise((resolve, reject) => {

      chatSchema.updateOne(query, {
        $pull: {
          "messages.$[elem].sent": userId
        },
        $pull: {
          "messages.$[elem].delivered": userId
        },
        $pull: {
          "messages.$[elem].seen": userId

        }
      }, {
        multi: true,
        arrayFilters: [{
          "elem._id": {
            $eq: messageId
          }
        }]
      }).exec((err, message) => {
        if (err) {
          let response = {
            success: false,
            message: err.message
          }

          reject(response);
          return callback(response);
        }
        let response = {
          success: true,
          message: 'You made the message as finished successfully.'
        }

        resolve(response);
        return callback(null, response);
      });

    });
  }; 

  /**
   * @name _makeMessageAsSeen
   * @function
   * @desc set a messages as seen
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeMessageAsSeen = (options, callback) => {
    callback = callback || function () {};

    let messageId = options.messageId;
    let userId = options.userId;
    let query = {
      'messages._id': messageId
    };
    return new Promise((resolve, reject) => {

      chatSchema.updateOne(query, {
        $pull: {
          "messages.$[elem].sent": userId

        },
        $pull: {
          "messages.$[elem].delivered": userId
        },
        $push: {
          "messages.$[elem].seen": userId

        }
      }, {
        multi: true,
        arrayFilters: [{
          "elem._id": {
            $eq: messageId
          }
        }]
      }).exec((err, message) => {
        if (err) {
          let response = {
            success: false,
            message: err.message
          }

          reject(response);
          return callback(response);
        }
        let response = {
          success: true,
          message: 'You made the message as seen successfully.'
        }

        resolve(response);
        return callback(null, response);
      });

    });
  };
  
  /**
   * @name _makeMessageAsDelivered
   * @function
   * @desc set a messages as delivered
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeMessageAsDelivered = (options, callback) => {
    callback = callback || function () {};

    let messageId = options.messageId;
    let userId = options.userId;
    let query = {
      'messages._id': messageId
    };
    return new Promise((resolve, reject) => {

      chatSchema.updateOne(query, {
        $pull: {
          "messages.$[elem].sent": userId

        },
        $push: {
          "messages.$[elem].delivered": userId

        }
      }, {
        multi: true,
        arrayFilters: [{
          "elem._id": {
            $eq: messageId
          }
        }]
      }).exec((err, message) => {
        if (err) {
          let response = {
            success: false,
            message: err.message
          }

          reject(response);
          return callback(response);
        }
        let response = {
          success: true,
          message: 'You made the message as delivered successfully.'
        }

        resolve(response);
        return callback(null, response);
      });

    });
  };

  /**
   * @name _unSentUserMessages
   * @function
   * @desc get a unsent  messages
   * @param {object} options message options
   * @return {array} the function return array
   */
  let _unSentUserMessages = (options, callback) => {
    callback = callback || function () {};

    if (options.is_group && options.groupId) {

      return new Promise((resolve, reject) => {
        chatSchema.aggregate([{
            $match: {
              $and: [{
                'messages.groupId': {
                  $exists: true
                },
                'messages.groupId': {
                  $eq: ObjectID(options.groupId)
                }
              }]
            }
          }, {
            "$addFields": {

              messages: {
                $filter: {
                  input: '$messages',
                  as: 'message',
                  "cond": {
                    "$and": [{
                        "$ne": ["$$message.sender", ObjectID(options.userId)]
                      },
                      {
                        "$in": [ObjectID(options.userId), "$$message.sent"]
                      }, {
                        "$not": [{
                          "$in": [ObjectID(options.userId), "$$message.deleted"]
                        }]
                      }

                    ]
                  }
                }
              }
            }
          },
          // Unwind the source
          {
            "$unwind": "$messages"
          },
          // Do the lookup matching
          {
            "$lookup": {

              from: 'users',
              let: {
                'sender': "$messages.sender"
              },
              pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ['$$sender', '$_id']
                    }
                  }
                },
                {
                  $project: {
                    "username": 1,
                    "phone": 1,
                    "image": 1,
                    "activated": 1,
                    "status": 1
                  }
                }
              ],
              "as": "sender"
            }
          },
          // Do the lookup matching
          {
            "$lookup": {

              from: 'groups',
              let: {
                'group': "$messages.groupId"
              },
              pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ['$$group', '$_id']
                    }
                  }
                },
                {
                  $project: {
                    "name": 1,
                    "image": 1,
                    "userId": 1,
                    "members.userId": 1
                  }
                }
              ],
              "as": "group"
            }
          },
          // Unwind the result arrays ( likely one or none )
          {
            "$unwind": "$sender"
          },
          // Unwind the result arrays ( likely one or none )
          {
            "$unwind": "$group"
          },
          // Group back to arrays
          {
            "$group": {
              "_id": "$_id",
              "messages": {
                "$push": {
                  message: "$messages",
                  sender: "$sender",
                  group: "$group"
                }
              }
            }
          }
        ]).exec((err, conversations) => {


          if (err || !conversations) {
            reject(new Error('failed loading conversations ' + err));
            return callback(new Error('failed loading conversations ' + err));
          }

          let messages = [];
          conversations.map((conversation) => {

            conversation.messages.map((messageObj) => {
              let item = messageObj.message;


              let senderUserStatusArray = _.where(messageObj.sender.status, {
                current: true
              });

              item.conversationId = conversation._id;
              item.status = 1;

              item.sender = messageObj.sender;
              item.sender.linked = true;
              item.sender.status = senderUserStatusArray[0];
              item.is_group = true;
              ////group

              item.group = messageObj.group;

              let members = [];
              item.group.members.map((member) => {

                member.owner = member.userId;
                delete member.userId;
                members.push(member);
              });
              item.group.owner = item.group.userId;
              ///group///
              delete item.group.userId;
              delete messageObj.group;
              delete item.groupId;
              delete item.deleted;
              delete item.sent;
              delete item.delivered;
              delete item.seen;
              messages.push(item);
            });

            delete conversation._id;
          });

          resolve(messages);
          return callback(null, messages);
        });
      });
    } else {

      return new Promise((resolve, reject) => {
        chatSchema.aggregate([{
              $match: {
                $and: [{
                  'messages.groupId': {
                    $exists: false
                  },
                  users: {
                    $in: [ObjectID(options.userId)]
                  }
                }]
              }
            }, {
              "$addFields": {

                messages: {
                  $filter: {
                    input: '$messages',
                    as: 'message',
                    "cond": {
                      "$and": [{
                          "$eq": ["$$message.recipient", ObjectID(options.userId)]
                        },
                        {
                          "$in": [ObjectID(options.userId), "$$message.sent"]
                        }, {
                          "$not": [{
                            "$in": [ObjectID(options.userId), "$$message.deleted"]
                          }]
                        }


                      ]
                    }
                  }
                }
              }
            },
            // Unwind the source
            {
              "$unwind": "$messages"
            },
            // Do the lookup matching
            {
              "$lookup": {

                from: 'users',
                let: {
                  'sender': "$messages.sender"
                },
                pipeline: [{
                    $match: {
                      $expr: {
                        $eq: ['$$sender', '$_id']
                      }
                    }
                  },
                  {
                    $project: {
                      "username": 1,
                      "phone": 1,
                      "image": 1,
                      "activated": 1,
                      "status": 1
                    }
                  }
                ],
                "as": "sender"
              }
            },
            // Do the lookup matching
            {
              "$lookup": {

                from: 'users',
                let: {
                  'recipient': "$messages.recipient"
                },
                pipeline: [{
                    $match: {
                      $expr: {
                        $eq: ['$$recipient', '$_id']
                      }
                    }
                  },
                  {
                    $project: {
                      "username": 1,
                      "phone": 1,
                      "image": 1,
                      "activated": 1,
                      "status": 1
                    }
                  }
                ],
                "as": "recipient"
              }
            },
            // Unwind the result arrays ( likely one or none )
            {
              "$unwind": "$sender"
            },
            // Unwind the result arrays ( likely one or none )
            {
              "$unwind": "$recipient"
            },
            // Group back to arrays
            {
              "$group": {
                "_id": "$_id",
                "messages": {
                  "$push": {
                    message: "$messages",
                    sender: "$sender",
                    recipient: "$recipient"
                  }
                }
              }
            }
          ])
          .exec((err, conversations) => {


            if (err || !conversations) {
              reject(new Error('failed loading conversations ' + err));
              return callback(new Error('failed loading conversations ' + err));
            }
            let messages = [];
            conversations.map((conversation) => {
              conversation.messages.map((messageObj) => {
                let item = messageObj.message;


                let senderUserStatusArray = _.where(messageObj.sender.status, {
                  current: true
                });

                let recipeintUserStatusArray = _.where(messageObj.recipient.status, {
                  current: true
                });


                item.conversationId = conversation._id;
                item.status = 1;

                item.sender = messageObj.sender;
                item.sender.linked = true;
                item.sender.status = senderUserStatusArray[0];

                item.recipient = messageObj.recipient;
                item.recipient.linked = true;
                item.recipient.status = recipeintUserStatusArray[0];
                item.is_group = false;
                delete item.deleted;
                delete item.sent;
                delete item.delivered;
                delete item.seen;

                messages.push(item);


              });
              delete conversation._id;
            });
            resolve(messages);
            return callback(null, messages);
          });

      });

    }
  };

  /**
   * @name _deliveredMessages
   * @function
   * @desc get a delivered  messages
   * @param {object} options message options
   * @return {array} the function return array
   */
  let _deliveredMessages = (options, callback) => {
    callback = callback || function () {};

    if (options.is_group && options.groupId) {

      return new Promise((resolve, reject) => {
        chatSchema.aggregate([{
            $match: {
              $and: [{
                'messages.groupId': {
                  $exists: true
                },
                'messages.groupId': {
                  $eq: ObjectID(options.groupId)
                }
              }]
            }
          }, {
            "$addFields": {

              messages: {
                $filter: {
                  input: '$messages',
                  as: 'message',
                  "cond": {
                    "$and": [{
                        "$eq": ["$$message.sender", ObjectID(options.userId)]
                      }, {
                        "$gte": [{
                            "$size": {
                              "$setIntersection": ["$$message.delivered"]
                            }
                          },
                          1
                        ]
                      }, {
                        "$not": [{
                          "$in": [ObjectID(options.userId), "$$message.deleted"]
                        }]
                      }

                    ]
                  }
                }
              }
            }
          },
          // Unwind the source
          {
            "$unwind": "$messages"
          },
          // Do the lookup matching
          {
            "$lookup": {

              from: 'users',
              let: {
                'sender': "$messages.sender"
              },
              pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ['$$sender', '$_id']
                    }
                  }
                },
                {
                  $project: {
                    "username": 1,
                    "phone": 1,
                    "image": 1,
                    "activated": 1,
                    "status": 1
                  }
                }
              ],
              "as": "sender"
            }
          },
          // Do the lookup matching
          {
            "$lookup": {

              from: 'groups',
              let: {
                'group': "$messages.groupId"
              },
              pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ['$$group', '$_id']
                    }
                  }
                },
                {
                  $project: {
                    "name": 1,
                    "image": 1,
                    "userId": 1,
                    "members.userId": 1
                  }
                }
              ],
              "as": "group"
            }
          },
          // Unwind the result arrays ( likely one or none )
          {
            "$unwind": "$sender"
          },
          // Unwind the result arrays ( likely one or none )
          {
            "$unwind": "$group"
          },
          // Group back to arrays
          {
            "$group": {
              "_id": "$_id",
              "messages": {
                "$push": {
                  message: "$messages",
                  sender: "$sender",
                  group: "$group"
                }
              }
            }
          }
        ]).exec((err, conversations) => {


          if (err || !conversations) {
            reject(new Error('failed loading conversations ' + err));
            return callback(new Error('failed loading conversations ' + err));
          }

          let messages = [];
          conversations.map((conversation) => {

            conversation.messages.map((messageObj) => {
              let item = messageObj.message;


              let senderUserStatusArray = _.where(messageObj.sender.status, {
                current: true
              });

              item.conversationId = conversation._id;
              item.status = 2;

              item.sender = messageObj.sender;
              item.sender.linked = true;
              item.sender.status = senderUserStatusArray[0];
              item.is_group = true;
              ////group

              item.group = messageObj.group;

              item.recipientId = item.delivered[0];
              let members = [];
              item.group.members.map((member) => {

                member.owner = member.userId;
                delete member.userId;
                members.push(member);
              });
              item.group.owner = item.group.userId;
              ///group///
              delete item.group.userId;
              delete messageObj.group;
              delete item.groupId;
              delete item.deleted;
              delete item.sent;
              delete item.seen;
              //  if(members.length == item.delivered.length){
              // delete item.delivered;
              messages.push(item);
              //  } 
            });

            delete conversation._id;
          });

          resolve(messages);
          return callback(null, messages);
        });
      });
    } else {

      return new Promise((resolve, reject) => {
        chatSchema.aggregate([{
              $match: {
                $and: [{
                  'messages.groupId': {
                    $exists: false
                  },
                  users: {
                    $in: [ObjectID(options.userId)]
                  }
                }]
              }
            }, {
              "$addFields": {

                messages: {
                  $filter: {
                    input: '$messages',
                    as: 'message',
                    "cond": {
                      "$and": [{
                          "$eq": ["$$message.sender", ObjectID(options.userId)]
                        },
                        {
                          "$in": ["$$message.recipient", "$$message.delivered"]
                        }, {
                          "$not": [{
                            "$in": [ObjectID(options.userId), "$$message.deleted"]
                          }]
                        }


                      ]
                    }
                  }
                }
              }
            },
            // Unwind the source
            {
              "$unwind": "$messages"
            },
            // Do the lookup matching
            {
              "$lookup": {

                from: 'users',
                let: {
                  'sender': "$messages.sender"
                },
                pipeline: [{
                    $match: {
                      $expr: {
                        $eq: ['$$sender', '$_id']
                      }
                    }
                  },
                  {
                    $project: {
                      "username": 1,
                      "phone": 1,
                      "image": 1,
                      "activated": 1,
                      "status": 1
                    }
                  }
                ],
                "as": "sender"
              }
            },
            // Do the lookup matching
            {
              "$lookup": {

                from: 'users',
                let: {
                  'recipient': "$messages.recipient"
                },
                pipeline: [{
                    $match: {
                      $expr: {
                        $eq: ['$$recipient', '$_id']
                      }
                    }
                  },
                  {
                    $project: {
                      "username": 1,
                      "phone": 1,
                      "image": 1,
                      "activated": 1,
                      "status": 1
                    }
                  }
                ],
                "as": "recipient"
              }
            },
            // Unwind the result arrays ( likely one or none )
            {
              "$unwind": "$sender"
            },
            // Unwind the result arrays ( likely one or none )
            {
              "$unwind": "$recipient"
            },
            // Group back to arrays
            {
              "$group": {
                "_id": "$_id",
                "messages": {
                  "$push": {
                    message: "$messages",
                    sender: "$sender",
                    recipient: "$recipient"
                  }
                }
              }
            }
          ])
          .exec((err, conversations) => {


            if (err || !conversations) {
              reject(new Error('failed loading conversations ' + err));
              return callback(new Error('failed loading conversations ' + err));
            }
            let messages = [];
            conversations.map((conversation) => {
              conversation.messages.map((messageObj) => {
                let item = messageObj.message;


                let senderUserStatusArray = _.where(messageObj.sender.status, {
                  current: true
                });

                let recipeintUserStatusArray = _.where(messageObj.recipient.status, {
                  current: true
                });


                item.conversationId = conversation._id;
                item.status = 2;

                item.sender = messageObj.sender;
                item.sender.linked = true;
                item.sender.status = senderUserStatusArray[0];

                item.recipient = messageObj.recipient;
                item.recipient.linked = true;
                item.recipient.status = recipeintUserStatusArray[0];
                item.is_group = false;
                delete item.deleted;
                delete item.sent;
                //  delete item.delivered;
                delete item.seen;

                messages.push(item);


              });
              delete conversation._id;
            });
            resolve(messages);
            return callback(null, messages);
          });

      });

    }
  };

  /**
   * @name _seenMessages
   * @function
   * @desc get a seen  messages
   * @param {object} options message options
   * @return {array} the function return array
   */
  let _seenMessages = (options, callback) => {
    callback = callback || function () {};

    if (options.is_group && options.groupId) {

      return new Promise((resolve, reject) => {
        chatSchema.aggregate([{
            $match: {
              $and: [{
                'messages.groupId': {
                  $exists: true
                },
                'messages.groupId': {
                  $eq: ObjectID(options.groupId)
                }
              }]
            }
          }, {
            "$addFields": {

              messages: {
                $filter: {
                  input: '$messages',
                  as: 'message',
                  "cond": {
                    "$and": [{
                        "$eq": ["$$message.sender", ObjectID(options.userId)]
                      }, {
                        "$gte": [{
                            "$size": {
                              "$setIntersection": ["$$message.seen"]
                            }
                          },
                          1
                        ]
                      }, {
                        "$not": [{
                          "$in": [ObjectID(options.userId), "$$message.deleted"]
                        }]
                      }

                    ]
                  }
                }
              }
            }
          },
          // Unwind the source
          {
            "$unwind": "$messages"
          },
          // Do the lookup matching
          {
            "$lookup": {

              from: 'users',
              let: {
                'sender': "$messages.sender"
              },
              pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ['$$sender', '$_id']
                    }
                  }
                },
                {
                  $project: {
                    "username": 1,
                    "phone": 1,
                    "image": 1,
                    "activated": 1,
                    "status": 1
                  }
                }
              ],
              "as": "sender"
            }
          },
          // Do the lookup matching
          {
            "$lookup": {

              from: 'groups',
              let: {
                'group': "$messages.groupId"
              },
              pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ['$$group', '$_id']
                    }
                  }
                },
                {
                  $project: {
                    "name": 1,
                    "image": 1,
                    "userId": 1,
                    "members.userId": 1
                  }
                }
              ],
              "as": "group"
            }
          },
          // Unwind the result arrays ( likely one or none )
          {
            "$unwind": "$sender"
          },
          // Unwind the result arrays ( likely one or none )
          {
            "$unwind": "$group"
          },
          // Group back to arrays
          {
            "$group": {
              "_id": "$_id",
              "messages": {
                "$push": {
                  message: "$messages",
                  sender: "$sender",
                  group: "$group"
                }
              }
            }
          }
        ]).exec((err, conversations) => {


          if (err || !conversations) {
            reject(new Error('failed loading conversations ' + err));
            return callback(new Error('failed loading conversations ' + err));
          }

          let messages = [];
          conversations.map((conversation) => {
            conversation.messages.map((messageObj) => {
              let item = messageObj.message;


              let senderUserStatusArray = _.where(messageObj.sender.status, {
                current: true
              });

              item.conversationId = conversation._id;
              item.status = 3;

              item.sender = messageObj.sender;
              item.sender.linked = true;
              item.sender.status = senderUserStatusArray[0];
              item.is_group = true;
              ////group

              item.group = messageObj.group;

              item.recipientId = item.seen[0];

              let members = [];
              item.group.members.map((member) => {

                member.owner = member.userId;
                delete member.userId;
                members.push(member);
              });
              item.group.owner = item.group.userId;
              ///group///
              delete item.group.userId;
              delete messageObj.group;
              delete item.groupId;
              delete item.deleted;
              delete item.sent;
              delete item.delivered;

              //  if(members.length == item.seen.length){
              // delete item.seen;
              messages.push(item);
              //  }
            });

            delete conversation._id;
          });

          resolve(messages);
          return callback(null, messages);
        });
      });
    } else {

      return new Promise((resolve, reject) => {
        chatSchema.aggregate([{
              $match: {
                $and: [{
                  'messages.groupId': {
                    $exists: false
                  },
                  users: {
                    $in: [ObjectID(options.userId)]
                  }
                }]
              }
            }, {
              "$addFields": {

                messages: {
                  $filter: {
                    input: '$messages',
                    as: 'message',
                    "cond": {
                      "$and": [{
                          "$eq": ["$$message.sender", ObjectID(options.userId)]
                        },
                        {
                          "$in": ["$$message.recipient", "$$message.seen"]
                        }, {
                          "$not": [{
                            "$in": [ObjectID(options.userId), "$$message.deleted"]
                          }]
                        }


                      ]
                    }
                  }
                }
              }
            },
            // Unwind the source
            {
              "$unwind": "$messages"
            },
            // Do the lookup matching
            {
              "$lookup": {

                from: 'users',
                let: {
                  'sender': "$messages.sender"
                },
                pipeline: [{
                    $match: {
                      $expr: {
                        $eq: ['$$sender', '$_id']
                      }
                    }
                  },
                  {
                    $project: {
                      "username": 1,
                      "phone": 1,
                      "image": 1,
                      "activated": 1,
                      "status": 1
                    }
                  }
                ],
                "as": "sender"
              }
            },
            // Do the lookup matching
            {
              "$lookup": {

                from: 'users',
                let: {
                  'recipient': "$messages.recipient"
                },
                pipeline: [{
                    $match: {
                      $expr: {
                        $eq: ['$$recipient', '$_id']
                      }
                    }
                  },
                  {
                    $project: {
                      "username": 1,
                      "phone": 1,
                      "image": 1,
                      "activated": 1,
                      "status": 1
                    }
                  }
                ],
                "as": "recipient"
              }
            },
            // Unwind the result arrays ( likely one or none )
            {
              "$unwind": "$sender"
            },
            // Unwind the result arrays ( likely one or none )
            {
              "$unwind": "$recipient"
            },
            // Group back to arrays
            {
              "$group": {
                "_id": "$_id",
                "messages": {
                  "$push": {
                    message: "$messages",
                    sender: "$sender",
                    recipient: "$recipient"
                  }
                }
              }
            }
          ])
          .exec((err, conversations) => {


            if (err || !conversations) {
              reject(new Error('failed loading conversations ' + err));
              return callback(new Error('failed loading conversations ' + err));
            }
            let messages = [];
            conversations.map((conversation) => {
              conversation.messages.map((messageObj) => {
                let item = messageObj.message;


                let senderUserStatusArray = _.where(messageObj.sender.status, {
                  current: true
                });

                let recipeintUserStatusArray = _.where(messageObj.recipient.status, {
                  current: true
                });


                item.conversationId = conversation._id;
                item.status = 3;

                item.sender = messageObj.sender;
                item.sender.linked = true;
                item.sender.status = senderUserStatusArray[0];

                item.recipient = messageObj.recipient;
                item.recipient.linked = true;
                item.recipient.status = recipeintUserStatusArray[0];
                item.is_group = false;
                delete item.deleted;
                delete item.sent;
                delete item.delivered;
                //  delete item.seen;

                messages.push(item);


              });
              delete conversation._id;
            });
            resolve(messages);
            return callback(null, messages);
          });

      });

    }
  };




  /**
   * @name _deleteConversation
   * @function
   * @desc set a conversation as deleted
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _deleteConversation = (options, callback) => {
    callback = callback || function () {};

    let conversationId = options.conversationId;

    let query = {
      '_id': conversationId
    };
    return new Promise((resolve, reject) => {
      chatSchema.findOne(query)
        .exec((err, conversation) => {
          if (err || !conversation) {
            let response = {
              success: false,
              message: 'Couldn\'t load the message'
            }
            reject(response);
            return callback(response);
          } else {

            conversation.messages.map((message) => {
              message.deleted.push(options.user._id);
            });

            conversation.save((err) => {
              if (err) {
                reject(new Error('Failed to set  conversation as deleted  please try again later'));
                return callback(new Error('Failed to set  conversation as deleted  please try again later'));
              }

              let response = {
                success: true,
                message: 'The conversation is deleted successfully.'
              }
              resolve(response);
              return callback(null, response);
            });
          }
        });
    });
  };

  /**
   * @name _deleteMessage
   * @function
   * @desc set a messages as deleted
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _deleteMessage = (options, callback) => {
    callback = callback || function () {};

    let messageId = options.messageId;

    let query = {
      'messages._id': messageId
    };
    return new Promise((resolve, reject) => {
      chatSchema.findOne(query)
        .exec((err, conversation) => {
          if (err || !conversation) {
            let response = {
              success: false,
              message: 'Couldn\'t load the message'
            }
            reject(response);
            return callback(response);
          } else {

            let messageObj = conversation.messages.id(messageId);
            if (!messageObj) {
              let error = new Error('message not found!');
              let response = {
                success: false,
                message: 'message not found!'
              }
              reject(response);
              return callback(response);
            } else {
              if (messageObj._id.toString() !== messageId.toString()) {
                let error = new Error('Authorization is failed!');

                let response = {
                  success: false,
                  message: 'Authorization is failed!'
                }
                reject(response);
                return callback(response);
              }

              messageObj.deleted.push(options.user._id);

              conversation.save((err) => {
                if (err) {
                  reject(new Error('Failed to set  message as deleted  please try again later'));
                  return callback(new Error('Failed to set  message as deleted  please try again later'));
                }

                let response = {
                  success: true,
                  message: 'The message is deleted successfully.'
                }
                resolve(response);
                return callback(null, response);
              });
            }

          }
        });
    });
  };

  return {
    getConversations: _getConversations,
    getSingleConversation: _getSingleConversation,
    unSentUserMessages: _unSentUserMessages,
    deliveredMessages: _deliveredMessages,
    seenMessages: _seenMessages,
    makeMessageAsFinished: _makeMessageAsFinished,
    makeMessageExistAsFinished: _makeMessageExistAsFinished,
    makeMessageAsSeen: _makeMessageAsSeen,
    makeMessageAsDelivered: _makeMessageAsDelivered,
    getSingleGroupConversation: _getSingleGroupConversation,
    sendMessage: _sendMessage,
    deleteMessage: _deleteMessage,
    deleteConversation: _deleteConversation
  };
})();