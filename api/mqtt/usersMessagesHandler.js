/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:54:06 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2020-01-01 16:19:27
 */

'use strict';

const chatsModule = require('../routes/app-modules/app-chat');
const usersModule = require('../routes/app-modules/app-users');
const groupsModule = require('../routes/app-modules/app-groups');
const _ = require('underscore');
const q = require('q');
module.exports = function () {
  return {
    /**
     * When user recipeint come online then fetch old messages and send them
     */
    unSentUserMessages: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          chatsModule.chatQueries.unSentUserMessages({
              userId: options.userId,
              is_group: options.is_group,
              groupId: options.groupId
            })
            .then((messages) => {
              resolve(messages);
              return callback(null, messages);
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();

    },
    /**
     * When user recipeint come online then fetch old group messages and send them
     */
    unSentGroupMessages: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {



          groupsModule.groupsQueries.checkMemberGroup({
              userId: options.userId
            })
            .then((groups) => {

              var promises = [];
              _.forEach(groups, (group) => {

                var deferred = q.defer(); //init promise
                chatsModule.chatQueries.unSentUserMessages({
                    userId: options.userId,
                    is_group: true,
                    groupId: group._id
                  })
                  .then((messages) => {


                    deferred.resolve(messages); // resolve the promise

                  })
                  .catch((err) => {
                    reject(new Error('error ' + err));
                    return callback(new Error('error' + err));
                  });
                promises.push(deferred.promise); // add promise to array, can be rejected or   fulfilled
              });


              q.all(promises).then(function (result) {

                resolve(result[0]);
                return callback(null, result[0]);
              });
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     *When user sender come online then fetch delivered messages and notify the sender
     */
    deliveredMessages: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          chatsModule.chatQueries.deliveredMessages({
              userId: options.userId,
              is_group: options.is_group,
              groupId: options.groupId
            })
            .then((messages) => {
              resolve(messages);
              return callback(null, messages);
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     *When user sender come online then fetch seen messages and notify the sender
     */
    seenMessages: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          chatsModule.chatQueries.seenMessages({
              userId: options.userId,
              is_group: options.is_group,
              groupId: options.groupId
            })
            .then((messages) => {
              resolve(messages);
              return callback(null, messages);
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },


    /**
     * mark messages as finished on server side
     */
    makeMessageExistAsFinished: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          chatsModule.chatQueries.makeMessageExistAsFinished({
              messageId: options.messageId
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },

    /**
     * mark messages as finished on server side
     */
    makeMessageAsFinished: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          chatsModule.chatQueries.makeMessageAsFinished({
              messageId: options.messageId,
              userId: options.userId,
              is_group: options.is_group
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },

    /**
     * mark messages as seen on server side
     */
    makeMessageAsSeen: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          chatsModule.chatQueries.makeMessageAsSeen({
              messageId: options.messageId,
              userId: options.userId
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },

    /**
     * mark messages as delivered on server side
     */
    makeMessageAsDelivered: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          chatsModule.chatQueries.makeMessageAsDelivered({
              messageId: options.messageId,
              userId: options.userId
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },


    /**
     * When user recipeint come online then fetch his own expired stories and send id to delete it on user side
     */
    myExpiredStories: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.myExpiredStories({
              userId: options.userId
            })
            .then((stories) => {
              resolve(stories);
              return callback(null, stories);
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     * When user recipeint come online then fetch expired stories and send id to delete it on user side
     */
    expiredStories: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.expiredStories({
              userId: options.userId
            })
            .then((stories) => {
              resolve(stories);
              return callback(null, stories);
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     * When user create a story and then send it to recipients
     */
    myUnSentUserStories: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.myUnSentUserStories({
              storyId: options.storyId,
              userId: options.userId
            })
            .then((stories) => {
              resolve(stories);
              return callback(null, stories);
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     * When user recipeint come online then fetch old stories and send them
     */
    unSentUserStories: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.unSentUserStories({
              userId: options.userId
            })
            .then((stories) => {
              resolve(stories);
              return callback(null, stories);
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     *When user sender come online then fetch seen stories and notify the sender
     */
    seenStories: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          usersModule.usersQueries.seenStories({
              userId: options.userId
            })
            .then((stories) => {
              resolve(stories);
              return callback(null, stories);
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     * mark story as expired on server side
     */
    makeStoryAsExpired: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.makeStoryAsExpired({
              storyId: options.storyId,
              userId: options.userId
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     * mark story as finished on server side
     */
    makeStoryExistAsFinished: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.makeStoryExistAsFinished({
              storyId: options.storyId
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     * mark story as finished on server side
     */
    makeStoryAsFinished: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.makeStoryAsFinished({
              storyId: options.storyId,
              userId: options.userId
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },

    /**
     * mark story as seen on server side
     */
    makeStoryAsSeen: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.makeStoryAsSeen({
              storyId: options.storyId,
              userId: options.userId
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },

    /**
     * When user recipeint come online then fetch old calls and send them
     */
    unSentUserCalls: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.unSentUserCalls({
              userId: options.userId
            })
            .then((calls) => {
              resolve(calls);
              return callback(null, calls);
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     *When user sender come online then fetch seen calls and notify the sender
     */
    seenCalls: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          usersModule.usersQueries.seenCalls({
              userId: options.userId
            })
            .then((calls) => {
              resolve(calls);
              return callback(null, calls);
            })
            .catch((err) => {
              reject(new Error('error ' + err));
              return callback(new Error('error' + err));
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     * mark call as finished on server side
     */
    makeCallExistAsFinished: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.makeCallExistAsFinished({
              callId: options.callId
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },
    /**
     * mark call as finished on server side
     */
    makeCallAsFinished: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.makeCallAsFinished({
              callId: options.callId,
              userId: options.userId
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    },

    /**
     * mark call as seen on server side
     */
    makeCallAsSeen: function (options, callback) {
      callback = callback || function () {};
      var myPromise = () => {
        return new Promise((resolve, reject) => {

          usersModule.usersQueries.makeCallAsSeen({
              callId: options.callId,
              userId: options.userId
            })
            .then((response) => {
              resolve(response);
              return callback(null, response);
            })
            .catch((err) => {
              reject(err);
              return callback(err);
            });
        });
      };

      //Step 2: async promise handler
      var callMyPromise = async () => {

        var result = await (myPromise());
        //anything here is executed after result is resolved
        return result;
      };
      return callMyPromise();
    }
  }
};