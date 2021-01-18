/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-12-02 22:53:44 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2020-01-01 17:16:40
 */
'use strict';

const _ = require('underscore');

const userSchema = require('../models/users');
const groupsModule = require('../routes/app-modules/app-groups');
const users = require('./users.js')();
const usersMessagesHandler = require('./usersMessagesHandler.js')();
const debugging = false;
module.exports = function (mqttServ) {


  // Triggers when mqtt server is ready to accept requests
  mqttServ.on('ready', function () {

    mqttServ.authenticate = authenticate;
    mqttServ.authorizePublish = authorizePublish;
    mqttServ.authorizeSubscribe = authorizeSubscribe;
    debug('Mosca server is up and running');
  });



  mqttServ.on("error", function (err) {
    debug("error: " + err);
  });
  // Triggers when new message is published
  mqttServ.on('published', function (packet, client) {
    debug(packet.topic + ': ' + packet.payload);

    /*****************************************************************************************************************************************
     ********************************************* Users Messages Methods  *****************************************************************
     *****************************************************************************************************************************************/
    //method to send messages to recipient



    if (packet.topic == "new_user_message_to_server") {

      var publishedData = JSON.parse(String(packet.payload));

      if (publishedData.data.is_group) {

        debug("publishedData.data.ids : " + publishedData.data.ids)
        var memberIds = publishedData.data.ids.slice(1, -1).replace(/ /g, "").split(',')

        debug("memberIds: " + memberIds)
        _.map(memberIds, function (memberId) {

          debug("memberIds=====> memberId : " + memberId)

          users.getUser({
              userId: memberId
            })
            .then((user) => {

              debug(" =======  the recipeint =====");

              //check for unsent messages on database to send them

              groupsModule.groupsQueries.checkMemberGroup({
                  userId: memberId
                })
                .then((groups) => {

                  _.forEach(groups, (group) => {

                    usersMessagesHandler.unSentUserMessages({
                        userId: memberId,
                        is_group: true,
                        groupId: group._id
                      })
                      .then((messages) => {
                        debug(" ======= the unsent group message list size is =====" + messages.length);
                        _.forEach(messages, (message) => {


                          debug(" =======  the recipeint topic =====" + memberId);
                          publishedData.data = message;

                          publishMessage(mqttServ, memberId, publishedData)
                        });

                      })
                      .catch((err) => {
                        reject(new Error('error ' + err));
                        return callback(new Error('error' + err));
                      });
                  });


                })
                .catch((err) => {
                  debug(" ===== there is no unsent group messages  ===== : " + err);
                });


            })
            .catch((err) => {
              debug(" ===== user not exist ===== : " + err);
            });
        });

      } else {
        debug(" =======  the recipeint =====" + publishedData.data.ownerId);

        //check for unsent users messages on database to send them
        usersMessagesHandler.unSentUserMessages({
            userId: publishedData.data.ownerId
          })
          .then((messages) => {
            debug(" ======= the unsent message list size is =====" + messages.length);
            _.forEach(messages, (message) => {

              debug(" =======  the recipeint topic =====" + message.recipient._id);
              publishedData.data = message;
              publishMessage(mqttServ, message.recipient._id, publishedData)

            });

          })
          .catch((err) => {

            debug(" ===== there is no unsent message ===== : " + err);

          });




      }

    } else if (packet.topic == "update_status_offline_messages_as_delivered") {

      var publishedData = JSON.parse(String(packet.payload));
      usersMessagesHandler.makeMessageAsDelivered({
          messageId: publishedData.data.messageId,
          userId: publishedData.data.recipientId
        })
        .then((response) => {
          debug(response);

          if (response.success) {
            var confirmDelivered = {
              "subscriber": publishedData.data.ownerId,
              "action": "chat_mine_delivered",
              "data": publishedData.data
            }
            publishMessage(mqttServ, publishedData.subscriber, confirmDelivered)



            debug(" =======  the recipeint topic =====" + publishedData.data.ownerId);
            let dataObject = {
              messageId: publishedData.data.messageId,
              ownerId: publishedData.data.ownerId,
              recipientId: publishedData.data.recipientId,
              is_group: publishedData.data.is_group,
              users: [publishedData.data.recipientId]
            }

            var published = {
              "subscriber": publishedData.data.recipientId,
              "action": "chat_delivered",
              "data": dataObject
            }

            publishMessage(mqttServ, publishedData.data.ownerId, published)



          }


        }).catch((err) => {
          debug(err);

        });
    } else if (packet.topic == "update_status_offline_messages_as_seen") {

      var publishedData = JSON.parse(String(packet.payload));

      usersMessagesHandler.makeMessageAsSeen({
          messageId: publishedData.data.messageId,
          userId: publishedData.data.recipientId
        })
        .then((response) => {
          debug(response);
          if (response.success) {


            var confirmSeen = {
              "subscriber": publishedData.data.ownerId,
              "action": "chat_mine_seen",
              "data": publishedData.data
            }
            publishMessage(mqttServ, publishedData.subscriber, confirmSeen)

            debug(" =======  the recipeint topic =====" + publishedData.data.ownerId);

            let dataObject = {
              messageId: publishedData.data.messageId,
              ownerId: publishedData.data.ownerId,
              recipientId: publishedData.data.recipientId,
              is_group: publishedData.data.is_group,
              users: [publishedData.data.recipientId]
            }

            var published = {
              "subscriber": publishedData.data.recipientId,
              "action": "chat_seen",
              "data": dataObject
            }

            publishMessage(mqttServ, publishedData.data.ownerId, published)




          }



        }).catch((err) => {
          debug(err);
        });
    } else if (packet.topic == "update_status_offline_messages_as_finished") {

      var publishedData = JSON.parse(String(packet.payload));


      usersMessagesHandler.makeMessageAsFinished({
          messageId: publishedData.data.messageId,
          userId: publishedData.data.recipientId,
          is_group: publishedData.data.is_group
        })
        .then((response) => {

        }).catch((err) => {
          //  debug(err); 
        });
    } else if (packet.topic == "update_status_offline_messages_exist_as_finished") {

      var publishedData = JSON.parse(String(packet.payload));
      usersMessagesHandler.makeMessageExistAsFinished({
          messageId: publishedData.data.messageId
        })
        .then((response) => {

        }).catch((err) => {
          debug(err);
        });
    } else if (packet.topic == "user_status_update") {

      var publishedData = JSON.parse(String(packet.payload));
      debug(" ====> The user with id => " + publishedData.subscriber + " \n<===== connected ====> " + +true);



      users.getUser({
          userId: publishedData.subscriber
        })
        .then((user) => {

          users.updateUser({
              userId: publishedData.subscriber,
              socketId: "null",
              connected: publishedData.connected,
              last_seen: Date.now()
            })
            .then((response) => {

              publishMessage(mqttServ, "whatsclone_topic", publishedData);

            })
            .catch((err) => {
              debug(" ===== user not updated ===== : " + err);
            });
        }).catch((err) => {
          debug(" ===== user not found ===== : " + err);
        });
    }



    /*****************************************************************************************************************************************
     ********************************************* Stroies   Methods  *****************************************************************
     *****************************************************************************************************************************************/
    if (packet.topic == "new_user_story_to_server") {

      var publishedData = JSON.parse(String(packet.payload));



      //check for unsent users messages on database to send them
      usersMessagesHandler.myUnSentUserStories({
          storyId: publishedData.data.storyId,
          userId: publishedData.data.ownerId
        })
        .then((stories) => {
          debug(" ======= the unsent stories list size is =====" + stories.length);
          _.forEach(stories, (story) => {

            let sentArray = _.pluck(story.sent, '_id');
            sentArray = sentArray.map((sentId) => {
              let recipientId = sentId.toString();
              delete story.sent;
              publishedData.data = story;
              debug(" =======  the recipeint topic =====" + recipientId);
              publishMessage(mqttServ, recipientId, publishedData)
            });

          });

          //next();
        })
        .catch((err) => {

          debug(" ===== there is no unsent stories ===== : " + err);

          //next(err);
        });





    } else  if (packet.topic == "update_status_offline_stories_as_expired") {

      var publishedData = JSON.parse(String(packet.payload));

      usersMessagesHandler.makeStoryAsExpired({
          storyId: publishedData.data.storyId,
          userId: publishedData.data.recipientId
        })
        .then((response) => {
          debug(response);

        }).catch((err) => {
          debug(err);
        });

    } else if (packet.topic == "update_status_offline_stories_as_seen") {

      var publishedData = JSON.parse(String(packet.payload));

      usersMessagesHandler.makeStoryAsSeen({
          storyId: publishedData.data.storyId,
          userId: publishedData.data.recipientId
        })
        .then((response) => {
          debug(response);
          if (response.success) {



            var confirmSeen = {
              "subscriber": publishedData.data.ownerId,
              "action": "story_mine_seen",
              "data": publishedData.data
            }
            publishMessage(mqttServ, publishedData.subscriber, confirmSeen)

            let dataObject = {
              storyId: publishedData.data.storyId,
              users: [publishedData.data.recipientId]
            }

            var published = {
              "subscriber": publishedData.data.recipientId,
              "action": "story_seen",
              "data": dataObject
            }

            publishMessage(mqttServ, publishedData.data.ownerId, published)

          }



        }).catch((err) => {
          debug(err);
        });
    } else if (packet.topic == "update_status_offline_stories_as_finished") {

      var publishedData = JSON.parse(String(packet.payload));

      usersMessagesHandler.makeStoryAsFinished({
          storyId: publishedData.data.storyId,
          userId: publishedData.data.recipientId
        })
        .then((response) => {

        }).catch((err) => {
          debug(err);
        });
    } else if (packet.topic == "update_status_offline_stories_exist_as_finished") {

      var publishedData = JSON.parse(String(packet.payload));

      usersMessagesHandler.makeStoryExistAsFinished({
          storyId: publishedData.data.storyId
        })
        .then((response) => {

        }).catch((err) => {
          debug(err);
        });

    }


    /*****************************************************************************************************************************************
     ********************************************* Calls   Methods  *****************************************************************
     *****************************************************************************************************************************************/
    if (packet.topic == "update_status_offline_calls_as_seen") {

      var publishedData = JSON.parse(String(packet.payload));

      usersMessagesHandler.makeCallAsSeen({
          callId: publishedData.data.callId,
          userId: publishedData.data.recipientId
        })
        .then((response) => {
          // debug(response);
          if (response.success) {



            var confirmSeen = {
              "subscriber": publishedData.data.ownerId,
              "action": "call_mine_seen",
              "data": publishedData.data
            }
            publishMessage(mqttServ, publishedData.subscriber, confirmSeen)



            var published = {
              "subscriber": publishedData.data.recipientId,
              "action": "call_seen",
              "data": publishedData.data
            }

            publishMessage(mqttServ, publishedData.data.ownerId, published)

          }

        }).catch((err) => {
          debug(err);
        });

    } else if (packet.topic == "update_status_offline_calls_as_finished") {

      var publishedData = JSON.parse(String(packet.payload));
      usersMessagesHandler.makeCallAsFinished({
          callId: publishedData.data.callId,
          userId: publishedData.data.recipientId
        })
        .then((response) => {

        }).catch((err) => {
          debug(err);
        });

    } else if (packet.topic == "update_status_offline_calls_exist_as_finished") {

      var publishedData = JSON.parse(String(packet.payload));
      usersMessagesHandler.makeCallExistAsFinished({
          callId: publishedData.data.callId
        })
        .then((response) => {
          debug(response);
        }).catch((err) => {
          debug(err);

        });

    }
  });


  /*****************************************************************************************************************************************
   ********************************************* Users Connection Methods  *****************************************************************
   *****************************************************************************************************************************************/

  // Triggers when the client  is connected
  mqttServ.on('clientConnected', function (client) {
    debug(" clientConnected " + String(client));
    debug(" ====> The user with id => " + client.id + " \n<===== connected ====> " + +true);




    users.updateUser({
        userId: client.id,
        socketId: "null",
        connected: true,
        last_seen: Date.now()
      })
      .then((response) => {


        var presence = {
          "subscriber": client.id,
          "action": "user_status",
          "connected": true,
          "isLastSeen": false,
          "lastSeen": Date.now()
        }
        publishMessage(mqttServ, client.id, presence);

      })
      .catch((err) => {
        debug(" ===== user not updated ===== : " + err);
      });

    //check for unsent messages on database to send them
    usersMessagesHandler.unSentUserMessages({
        userId: client.id
      })
      .then((messages) => {
        debug(" ======= the unsent message list size is =====" + messages.length);
        _.forEach(messages, (message) => {

          debug(" =======  the recipeint topic =====" + client.id);

          var publishedData = {
            "subscriber": message.sender._id,
            "action": "chat",
            "data": message
          }
          publishMessage(mqttServ, client.id, publishedData);

        });
        //check for delivered messages on database to notify user
        usersMessagesHandler.deliveredMessages({
            userId: client.id
          })
          .then((messages) => {
            debug(" ======= the delivered message list size is =====" + messages.length);

            _.forEach(messages, (message) => {
              debug(" =======  the recipeint =====" + message.recipient._id);

              let dataObject = {
                messageId: message._id,
                ownerId: message.sender._id,
                recipientId: message.recipient._id,
                is_group: message.is_group,
                users: message.delivered
              }



              debug(" =======  the recipeint topic =====" + client.id);

              var publishedData = {
                "subscriber": message.recipient._id,
                "action": "chat_delivered",
                "data": dataObject
              }
              publishMessage(mqttServ, client.id, publishedData);

            });
            //check for seen messages on database to notify user
            usersMessagesHandler.seenMessages({
                userId: client.id
              })
              .then((messages) => {
                debug(" ======= the seen message list size is =====" + messages.length);

                _.forEach(messages, (message) => {
                  debug(" =======  the recipeint =====" + message.sender._id);

                  let dataObject = {
                    messageId: message._id,
                    ownerId: message.sender._id,
                    recipientId: message.recipient._id,
                    is_group: message.is_group,
                    users: message.seen
                  }




                  debug(" =======  the recipeint topic =====" + client.id);

                  var publishedData = {
                    "subscriber": message.recipient._id,
                    "action": "chat_seen",
                    "data": dataObject
                  }
                  publishMessage(mqttServ, client.id, publishedData);

                });
              })
              .catch((err) => {
                debug(" ===== there is no seen message ===== : " + err);
              });

          })
          .catch((err) => {
            debug(" ===== there is no delivered message ===== : " + err);
          });
      })
      .catch((err) => {
        debug(" ===== there is no unsent message ===== : " + err);
      });

    //check for groups messages

    //check for unsent messages on database to send them
    //
    //
    groupsModule.groupsQueries.checkMemberGroup({
        userId: client.id
      })
      .then((groups) => {

        debug(" ======= the check group  list size is =====" + groups.length);
        _.forEach(groups, (group) => {

          debug(" ======= the check group id =====" + group._id);
          usersMessagesHandler.unSentUserMessages({
              userId: client.id,
              is_group: true,
              groupId: group._id
            })
            .then((messages) => {
              debug(" ======= the unsent group message list size is =====" + messages.length);
              _.forEach(messages, (message) => {

                debug(" =======  the recipeint topic =====" + client.id);
                var publishedData = {
                  "subscriber": message.sender._id,
                  "action": "chat",
                  "data": message
                }

                publishMessage(mqttServ, client.id, publishedData)
              });

              //check for delivered messages on database to notify user
              usersMessagesHandler.deliveredMessages({
                  userId: client.id,
                  is_group: true,
                  groupId: group._id
                })
                .then((messages) => {
                  debug(" ======= the delivered group message list size is =====" + messages.length);

                  _.forEach(messages, (message) => {


                    debug(" =======  the recipeint topic =====" + client.id);

                    let dataObject = {
                      messageId: message._id,
                      ownerId: message.sender._id,
                      recipientId: message.recipientId,
                      is_group: message.is_group,
                      users: message.delivered
                    }
                    var publishedData = {
                      "subscriber": message.recipientId,
                      "action": "chat_delivered",
                      "data": dataObject
                    }


                    publishMessage(mqttServ, client.id, publishedData)

                  });
                  //check for seen messages on database to notify user
                  usersMessagesHandler.seenMessages({
                      userId: client.id,
                      is_group: true,
                      groupId: group._id
                    })
                    .then((messages) => {
                      debug(" ======= the seen group message list size is =====" + messages.length);

                      _.forEach(messages, (message) => {


                        debug(" =======  the recipeint topic =====" + client.id);
                        let dataObject = {
                          messageId: message._id,
                          ownerId: message.sender._id,
                          recipientId: message.recipientId,
                          is_group: message.is_group,
                          users: message.seen
                        }
                        var publishedData = {
                          "subscriber": message.recipientId,
                          "action": "chat_seen",
                          "data": dataObject
                        }


                        publishMessage(mqttServ, client.id, publishedData)

                      });
                    })
                    .catch((err) => {
                      debug(" ===== there is no seen message ===== : " + err);
                    });

                })
                .catch((err) => {
                  debug(" ===== there is no delivered message ===== : " + err);
                });

            })
            .catch((err) => {

              debug(" ===== there is  errror ===== : " + err);
            });
        });


      })
      .catch((err) => {
        debug(" ===== there is no unsent group messages  ===== : " + err);
      });

    //check for stories
    //check for unsent stories on database to send them

    usersMessagesHandler.unSentUserStories({
        userId: client.id
      })
      .then((stories) => {
        debug(" ======= the unsent stories list size is =====" + stories.length);
        _.forEach(stories, (story) => {

          debug(" =======  the recipeint topic =====" + client.id);


          var publishedData = {
            "subscriber": story.owner._id,
            "action": "story",
            "data": story
          }
          publishMessage(mqttServ, client.id, publishedData)

        });

      })
      .catch((err) => {
        debug(" ===== there is no unsent stories ===== : " + err);
      });
    //check for my own expired stories on database and send them

    usersMessagesHandler.myExpiredStories({
        userId: client.id
      })
      .then((stories) => {
        debug(" ======= the my expired stories list size is =====" + stories.length);

        _.forEach(stories, (story) => {

          var publishedData = {
            "subscriber": story.owner._id,
            "action": "expired_story",
            "data": story
          }
          publishMessage(mqttServ, client.id, publishedData)


        });

      })
      .catch((err) => {
        debug(" ===== there is no my expired stories ===== : " + err);
      });

    //check for expired stories on database to send them

    usersMessagesHandler.expiredStories({
        userId: client.id
      })
      .then((stories) => {
        debug(" ======= the expired stories list size is =====" + stories.length);
        _.forEach(stories, (story) => {


          var publishedData = {
            "subscriber": story.owner._id,
            "action": "expired_story",
            "data": story
          }
          publishMessage(mqttServ, client.id, publishedData)


        });

      })
      .catch((err) => {
        debug(" ===== there is no expired stories ===== : " + err);
      });

    //check for seen stories on database to notify user
    usersMessagesHandler.seenStories({
        userId: client.id
      })
      .then((stories) => {
        debug(" ======= the seen story list size is =====" + stories.length);

        _.forEach(stories, (story) => {
          debug(" =======  the recipeint =====" + client.id);

          let dataObject = {
            storyId: story._id,
            users: story.seen
          }


          var publishedData = {
            "subscriber": story.seen[0],
            "action": "story_seen",
            "data": dataObject
          }
          publishMessage(mqttServ, client.id, publishedData)





        });
      })
      .catch((err) => {
        debug(" ===== there is no seen story ===== : " + err);
      });

    //check for calls
    //check for unsent calls on database to send them

    usersMessagesHandler.unSentUserCalls({
        userId: client.id
      })
      .then((calls) => {
        debug(" ======= the unsent calls list size is =====" + calls.length);
        _.forEach(calls, (call) => {




          let callObj;

          callObj = {
            'callId': call.callId,
            'call_from': call.call_from,
            'call_id': call.call_id,
            'callType': call.callType,
            'status': 'init_call',
            'date': call.date,
            'owner': call.owner,
            'missed': true
          }

          var publishedData = {
            "subscriber": call.call_from,
            "action": "call",
            "data": callObj
          }
          publishMessage(mqttServ, client.id, publishedData)



        });

      })
      .catch((err) => {
        debug(" ===== there is no unsent calls ===== : " + err);
      });

    //check for seen calls on database to notify user
    usersMessagesHandler.seenCalls({
        userId: client.id
      })
      .then((calls) => {
        debug(" ======= the seen call list size is =====" + calls.length);

        _.forEach(calls, (call) => {
          debug(" =======  the recipeint =====" + client.id);

          let dataObject = {
            callId: call._id,
            users: call.seen
          }

          var publishedData = {
            "subscriber": call.call_from,
            "action": "call_seen",
            "data": dataObject
          }
          publishMessage(mqttServ, client.id, publishedData)


        });
      })
      .catch((err) => {
        debug(" ===== there is no seen call ===== : " + err);
      });






  });


  // Triggers when the client  is Disconnected
  mqttServ.on('subscribed', function (client) {
    debug('subscribed : ' + client.toString());
  });

  // Triggers when the client  is Disconnected
  mqttServ.on('clientDisconnected', function (client) {
    debug('clientDisconnected : ' + client.id);
    users.updateUser({
        userId: client.id,
        socketId: "null",
        connected: false,
        last_seen: Date.now()
      })
      .then((response) => {


        var presence = {
          "subscriber": client.id,
          "action": "user_status",
          "connected": false,
          "isLastSeen": false,
          "lastSeen": Date.now()

        }
        publishMessage(mqttServ, client.id, presence);
      })
      .catch((err) => {
        debug(" ===== user not updated ===== : " + err);
      });
  });
};
/**
 * 
 *  Method to publish messages
 */


function publishMessage(mqttServ, topicOfInterest, objectPayload) {

  var textPayload = JSON.stringify(objectPayload);
  var bufferPayload = Buffer.from(textPayload, 'utf-8');
  var packet = {
    topic: String(topicOfInterest),
    //payload: textPayload,
    payload: bufferPayload,
    qos: 0,
    retain: false,
  };

  mqttServ.publish(packet, function () {
    debug('MQTT broker message sent');
  });
}

/**
 * 
 *  Method to debug
 */
function debug(name) {
  if (debugging)
    console.log(name);
}


/**
 * 
 *  Method to authenticate
 */
var authenticate = function (client, username, password, callback) {


  isUserAuthenticated({
      authorization: password.toString()
    })
    .then((user) => {
      debug(" ======= Token valid authorized =====");
      callback(null, true);
    })
    .catch((err) => {

      debug(" ===== Is not a valid token =====\n ======= Unauthorized to access ===== : " + err);

      callback(null, false);
    });

}

var authorizePublish = function (client, topic, payload, callback) {
  callback(null, true);
}

var authorizeSubscribe = function (client, topic, callback) {
  callback(null, true);
}

/**
 * check if user token is valid
 **/
let isUserAuthenticated = (options, callback) => {
  callback = callback || function () {};
  return new Promise((resolve, reject) => {
    userSchema.findOne({
      auth_token: options.authorization
    }).select('_id').exec(
      (err, user) => {
        if (err) {
          reject(new Error('error ' + err));
          return callback(new Error('error' + err));
        }
        if (!user) {
          reject(new Error('user not connected'));
          return callback(new Error('user not connected'));
        }
        resolve(user);
        return callback(null, user);
      });


  });
};