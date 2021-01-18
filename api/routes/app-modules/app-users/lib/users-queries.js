/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:52:32 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2020-01-01 16:50:36
 */

'use strict';
const _ = require('underscore');
const q = require('q');
const userSchema = require('../../../../models/users');
const settings = require('../../../../models/settings');

var mongo = require('mongodb'),
  ObjectID = mongo.ObjectID;



/** @module AppUsers/UsersQueries */
let usersQueries = (function () {


  /**
   * @name _comparePhoneNumbers
   * @function
   * @desc Check if users has an account on the application
   * @param {object} options users list
   * @return {array} the function return users list
   */
  let _comparePhoneNumbers = (options, callback) => {
    callback = callback || function () {};
    let users_list = options.users_list;

    return new Promise((resolve, reject) => {

      /**
       * User object
       */
      var User = function (_id, contactID, username, Linked, Activate, Exist, phone, image, status) {
        this._id = _id;
        this.contactId = contactID;
        this.username = username;
        this.linked = Linked;
        this.activate = Activate;
        this.exist = Exist;
        this.phone = phone;
        this.image = image;
        this.status = status;
      };


      var promises = [];
      _.forEach(users_list, (user) => {
        var phone = user.phone;
        var phone_qurey = user.phone_qurey;
        var username = user.username;
        var image = user.image;
        var contactID = user.contactId;

        var deferred = q.defer(); //init promise
        userSchema.findOne({
          phone: {
            $regex: '.*' + phone_qurey + '.*'
          }
        }).select('-auth_token').exec(
          (err, user) => {
            if (err) return next(err);
            if (user) {
              let status_user = [];
              user.status.map((status) => {
                if (status.current == true) {
                  status_user.push(status);
                }
              });
              if (user.activated) {
                var user = new User(user._id, '' + contactID + '', !user.username ? username : user.username, true, true, true, user.phone, user.image, status_user[0]);
                deferred.resolve(user); // resolve the promise
              } else {
                var user = new User(user._id, '' + contactID + '', !user.username ? username : user.username, true, false, true, user.phone, user.image, status_user[0]);
                deferred.resolve(user); // resolve the promise
              }
            } else {
              var user = new User('' + contactID + '', '' + contactID + '', username, false, false, true, phone, image, null, null);
              deferred.resolve(user); // resolve the promise
            }

          });
        promises.push(deferred.promise); // add promise to array, can be rejected or   fulfilled
      });

      q.all(promises).then(function (result) {
        resolve(result);
        return callback(null, result);
      });

    });


  };

  /**
   * @name _getUser
   * @function
   * @desc get single user information
   * @param {object} userId
   * @return {object} the function return user info
   *  @apiSuccessExample {json} Response-Example:
   */
  let _getUser = (userId, callback) => {

    callback = callback || function () {};
    return new Promise((resolve, reject) => {
      var userData;
      userSchema.findOne({
          _id: userId
        }).select('-auth_token')
        .exec((err, user) => {

          if (err || !user) {
            let error = new Error('User not found!');
            reject(error);
            return callback(error);
          } else {

            let status_user = _.where(user.status, {
              current: true
            });

            userData = {
              _id: user._id,
              username: user.username,
              phone: user.phone,
              image: user.image,
              status: status_user[0],
              activate: user.activated,
              linked: true,
              connected: user.connected,
              socketId: user.socketId,
              last_seen: user.last_seen

            }


            resolve(userData);
            return callback(null, userData);
          }
        });
    });
  };



  /**
   * @name _getUserBySocketID
   * @function
   * @desc get single user information
   * @param {object} userId
   * @return {object} the function return user info
   *  @apiSuccessExample {json} Response-Example:
   */
  let _getUserBySocketID = (socketId, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {
      var userData;
      userSchema.findOne({
          socketId: socketId
        }).select('-auth_token')
        .exec((err, user) => {

          if (err || !user) {
            let error = new Error('User not found!');
            reject(error);
            return callback(error);
          } else {

            let status_user = _.where(user.status, {
              current: true
            });

            userData = {
              _id: user._id,
              username: user.username,
              phone: user.phone,
              image: user.image,
              status: status_user[0],
              activate: user.activated,
              linked: true,
              connected: user.connected,
              socketId: user.socketId,
              last_seen: user.last_seen

            }

            resolve(userData);
            return callback(null, userData);
          }
        });
    });
  };


  /**
   * @name _editImage
   * @function
   * @desc update user image
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _editImage = (options, callback) => {
    callback = callback || function () {};
    let userId = options.user._id;
    let data = {
      image: options.image
    }
    return new Promise((resolve, reject) => {
      userSchema.findOneAndUpdate({
        _id: userId
      }, data, {
        new: true
      }, function (err, user) {
        if (err || !user) {
          let responseError = {
            success: false,
            message: 'Failed to update your image plse try again later'
          }
          reject(responseError);
          return callback(responseError);
        } else {
          let response = {
            success: true,
            message: 'Your image is changed successfully.'
          }
          resolve(response);
          return callback(null, response);
        }

      });
    });
  };

  /**
   * @name _editName
   * @function
   * @desc update username
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _editName = (options, callback) => {
    callback = callback || function () {};
    let userId = options.user._id;
    let data = {
      username: options.username
    }
    return new Promise((resolve, reject) => {
      userSchema.findOneAndUpdate({
        _id: userId
      }, data, {
        new: true
      }, function (err, user) {
        if (err || !user) {
          let responseError = {
            success: false,
            message: 'Failed to update your username plse try again later'
          }
          reject(responseError);
          return callback(responseError);
        } else {
          let response = {
            success: true,
            message: 'Your username is changed successfully.'
          }
          resolve(response);
          return callback(null, response);
        }

      });
    });
  };

  /**
   * @name _editUserState
   * @function
   * @desc update user socket state
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _editUserState = (options, callback) => {
    callback = callback || function () {};
    let userId = options.userId;
    let data = {
      socketId: options.socketId,
      connected: options.connected,
      last_seen: options.last_seen
    }
    return new Promise((resolve, reject) => {
      userSchema.findOneAndUpdate({
        _id: userId
      }, data, {
        new: true
      }, function (err, user) {
        if (err || !user) {
          let responseError = {
            success: false,
            message: 'Failed to update your user state plse try again later'
          }
          reject(responseError);
          return callback(responseError);
        } else {
          let response = {
            success: true,
            message: 'Your user state is changed successfully.'
          }
          resolve(response);
          return callback(null, response);
        }

      });
    });
  };

  /**
   * @name _blockUser
   * @function
   * @desc block a user
   * @param {object} options current user and userId
   * @return {object} the function return response
   */
  let _blockUser = (options, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {
      userSchema.findOne({
          _id: options.user._id
        })
        .select('-auth_token')
        .exec((err, user) => {

          if (err || !user) {
            reject(new Error('Couldn\'t load the user'));
            return callback(new Error('Couldn\'t load the user'));
          }
          if (!user.blocking.id(options.userId)) {
            user.blocking.push({
              _id: options.userId,
              userId: options.userId
            });
          }
          user.save((err) => {
            if (err) {
              reject(new Error('Failed blocking the user please try again later'));
              return callback(new Error('Failed blocking the user please try again later'));
            }
            resolve(user);
            return callback(null, user);
          });
        });
    });
  };

  /**
   * @name _unBlockUser
   * @function
   * @desc unblock a user
   * @param {object} options current user and userId
   * @return {object} the function return response
   */
  let _unBlockUser = (options, cb) => {
    cb = cb || function () {};
    return new Promise((resolve, reject) => {
      userSchema.findOne({
          _id: options.user._id
        })
        .select('-auth_token')
        .exec((err, user) => {
          if (err || !user) {
            reject(new Error('Couldn\'t load the user'));
            return cb(new Error('Couldn\'t load the user'));
          }
          user.blocking = _.without(user.blocking, user.blocking.id(options.userId));
          user.save((err) => {
            if (err) {
              reject(new Error('Failed blocking the user please try again later'));
              return cb(new Error('Failed blocking the user please try again later'));
            }
            resolve(user);
            return cb(null, user);
          });
        });
    });
  };


  /**
   * @name _addStatus
   * @function
   * @desc add new status
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _addStatus = (options, callback) => {
    callback = callback || function () {};
    let userId = options.user._id;
    let status = options.status;
    let query = {
      '_id': userId
    };
    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, user) => {
          if (err || !user) {
            reject(new Error('Couldn\'t load the user'));
            return callback(new Error('Couldn\'t load the user'));
          } else {
            let statusObj = user.status.id(options.statusId);
            if (!statusObj) {
              let error = new Error('Status not found!');
              reject(error);
              return callback(error);
            } else {
              if (statusObj.userId.toString() !== userId.toString()) {
                let error = new Error('Authorization is failed!');
                reject(error);
                return callback(error);
              }
              let dataObj = {
                current: false
              }
              statusObj = _.extend(statusObj, dataObj);

              user.status.push({
                _id: new ObjectID(),
                userId: userId,
                body: status,
                current: true
              });
              user.save((err) => {
                if (err) {
                  reject(new Error('Failed to add the user status please try again later'));
                  return callback(new Error('Failed to add the user status  please try again later'));
                }
                resolve(statusObj);
                return callback(null, statusObj);
              });
            }

          }
        });
    });
  };

  /**
   * @name _deleteStatus
   * @function
   * @desc delete a status
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _deleteStatus = (options, callback) => {
    callback = callback || function () {};
    let userId = options.user._id;
    let query = {
      '_id': userId
    };
    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, user) => {
          if (err || !user) {
            reject(new Error('Couldn\'t load the user'));
            return callback(new Error('Couldn\'t load the user'));
          } else {
            let statusObj = user.status.id(options.statusId);
            if (!statusObj) {
              let error = new Error('Status not found!');
              reject(error);
              return callback(error);
            } else {
              if (statusObj.userId.toString() !== userId.toString()) {
                let error = new Error('Authorization is failed!');
                reject(error);
                return callback(error);
              }
              if (statusObj.is_default) {
                let error = new Error('You can\'t remove the default status!');
                reject(error);
                return callback(error);
              }
              user.status = _.without(user.status, user.status.id(options.statusId));
              user.save((err) => {
                if (err) {
                  reject(new Error('Failed to delete the user status please try again later'));
                  return callback(new Error('Failed to delete the user status  please try again later'));
                }
                resolve(statusObj);
                return callback(null, statusObj);
              });
            }

          }
        });
    });
  };

  /**
   * @name _deleteAllStatus
   * @function
   * @desc delete all status
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _deleteAllStatus = (options, callback) => {
    callback = callback || function () {};
    let userId = options.user._id;
    let query = {
      '_id': userId
    };
    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, user) => {
          if (err || !user) {
            reject(new Error('Couldn\'t load the user'));
            return callback(new Error('Couldn\'t load the user'));
          } else {
            _.forEach(user.status, (status) => {
              if (!status.is_default)
                user.status = _.without(user.status, user.status.id(status._id));
            });
            user.save((err) => {
              if (err) {
                reject(new Error('Failed to delete the user status please try again later'));
                return callback(new Error('Failed to delete the user status  please try again later'));
              }
              resolve(user.status);
              return callback(null, user.status);
            });
            //}

          }
        });
    });
  };


  /**
   * @name _setCurrentStatus
   * @function
   * @desc set a status as current
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _setCurrentStatus = (options, callback) => {
    callback = callback || function () {};
    let userId = options.user._id;
    let query = {
      '_id': userId
    };
    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, user) => {
          if (err || !user) {
            reject(new Error('Couldn\'t load the user'));
            return callback(new Error('Couldn\'t load the user'));
          } else {
            if (options.statusId == "undefined") {


              let currentStatusObj = user.status.id(options.currentStatusId);
              if (!currentStatusObj) {
                let error = new Error('Status not found!');
                reject(error);
                return callback(error);
              } else {
                if (currentStatusObj.userId.toString() !== userId.toString()) {
                  let error = new Error('Authorization is failed!');
                  reject(error);
                  return callback(error);
                }
                let currentDataObj = {
                  current: true
                }

                currentStatusObj = _.extend(currentStatusObj, currentDataObj);


                user.save((err) => {
                  if (err) {
                    reject(new Error('Failed to set as current status  please try again later'));
                    return callback(new Error('Failed to set as current status  please try again later'));
                  }
                  resolve(currentStatusObj);
                  return callback(null, currentStatusObj);
                });
              }
            } else {


              let statusObj = user.status.id(options.statusId);
              let currentStatusObj = user.status.id(options.currentStatusId);
              if (!statusObj || !currentStatusObj) {
                let error = new Error('Status not found!');
                reject(error);
                return callback(error);
              } else {
                if (statusObj.userId.toString() !== userId.toString()) {
                  let error = new Error('Authorization is failed!');
                  reject(error);
                  return callback(error);
                }
                let currentDataObj = {
                  current: true
                }

                let dataObj = {
                  current: false
                }
                currentStatusObj = _.extend(currentStatusObj, currentDataObj);
                statusObj = _.extend(statusObj, dataObj);

                user.save((err) => {
                  if (err) {
                    reject(new Error('Failed to set as current status  please try again later'));
                    return callback(new Error('Failed to set as current status  please try again later'));
                  }
                  resolve(currentStatusObj);
                  return callback(null, currentStatusObj);
                });
              }
            }
          }
        });
    });
  };
  /**
   * @name _getStatus
   * @function
   * @desc get single user status list
   * @param {object} userId
   * @return {object} the function return status user
   *  @apiSuccessExample {json} Response-Example:
   */
  let _getStatus = (userId, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {

      userSchema.findOne({
          _id: userId
        }).select('-auth_token')
        .exec((err, user) => {

          if (err || !user) {
            let error = new Error('User not found!');
            reject(error);
            return callback(error);
          } else {

            let status_user = [];
            user.status.map((status) => {
              status_user.push(status);
            });


            resolve(status_user);
            return callback(null, status_user);
          }
        });
    });
  };


  /**
   * @name _getSettings
   * @function
   * @param {object} options account options
   * @desc getSettings
   * @return {object} the function return response
   */
  let _getSettings = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {


      settings.find({}).select(' -_id ')
        .exec((err, settings) => {
          if (err || !settings) {
            let error = new Error('setting not found!');
            reject(error);
            return callback(error);
          } else {

            var setting_data = {};
            settings.forEach(function (setting) {
              setting_data[setting.name] = setting.value;
            });
            resolve(setting_data);
            return callback(null, setting_data);
          }
        });

    });

  };

  /********************************************************************************************************************************************
   * ********************************************************************    Calls functions ************************************************
   * ******************************************************************************************************************************************/

  /**
   * @name _saveNewCall
   * @function
   * @desc save new call
   * @param {object} options
   * @return {object} the function return response
   */
  let _saveNewCall = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      if (options.body.update == "true") {


        let callId = options.body.callId;

        let query = {
          'calls._id': callId
        };
        userSchema.findOne(query)
          .select('-auth_token')
          .exec((err, userFetched) => {
            if (err || !userFetched) {
              let response = {
                success: false,
                message: 'Couldn\'t load the call'
              }
              reject(response);
              return callback(response);
            } else {

              let callObj = userFetched.calls.id(callId);
              if (!callObj) {
                let error = new Error('call not found!');
                let response = {
                  success: false,
                  message: 'call not found!'
                }
                reject(response);
                return callback(response);
              } else {
                if (callObj._id.toString() !== callId.toString()) {
                  let error = new Error('Authorization is failed!');

                  let response = {
                    success: false,
                    message: 'Authorization is failed!'
                  }
                  reject(response);
                  return callback(response);
                }



                callObj.duration = options.body.duration;
                userFetched.save((err) => {
                  if (err) {
                    reject(new Error('Failed to set  call duration  please try again later'));
                    return callback(new Error('Failed to set  call duration  please try again later'));
                  }

                  let response = {
                    success: true,
                    message: 'You changed the call duration successfully.'
                  }
                  resolve(response);
                  return callback(null, response);
                });
              }

            }
          });


      } else {


        userSchema.findById(options.user._id)
          .select('calls')
          .exec((err, userFetched) => {

            if (err) {

              reject(new Error('Oops something went wrong'));
              return callback(new Error('Oops something went wrong'));
            }

            let call = {
              userId: options.user._id
            };


            if (options.body.date) {
              call.created = options.body.date;
            }

            if (options.body.isVideo) {
              call.type = options.body.isVideo;
            }
            if (options.body.duration) {
              call.duration = options.body.duration;
            }

            call.sent = [options.body.toId];
            call.users = [options.body.toId];

            userFetched.calls.push(call);
            userFetched.save((err, userInserted) => {
              if (err) {
                var callData = {
                  success: false,
                  message: 'Couldn\'t save your call please try again later' + err,
                  callId: null
                }
                reject(callData);
                return callback(callData);
              }

              var callData = {
                success: true,
                message: 'Call has been saved successfully.',
                callId: userInserted.calls[userInserted.calls.length - 1]._id
              }

              resolve(callData);
              return callback(null, callData);

            });

          });
      }


    });
  };


  /**
   * @name _unSentUserCalls
   * @function
   * @desc get a unsent  calls
   * @param {object} options call options
   * @return {array} the function return array
   */
  let _unSentUserCalls = (options, callback) => {
    callback = callback || function () {};

    let callId = options.callId;

    return new Promise((resolve, reject) => {
      userSchema.aggregate([{
          $match: {
            $and: [{
              _id: {
                $ne: [ObjectID(options.userId)]
              }
            }]

          }
        }, {
          "$addFields": {

            calls: {
              $filter: {
                input: '$calls',
                as: 'call',
                "cond": {
                  "$and": [{
                      "$in": [ObjectID(options.userId), "$$call.users"]
                    },
                    {
                      "$in": [ObjectID(options.userId), "$$call.sent"]
                    },
                    {
                      "$ne": [true, "$$call.deleted"]
                    }


                  ]
                }
              }
            }
          }
        },
        // Unwind the source
        {
          "$unwind": "$calls"
        },
        // Do the lookup matching
        {
          "$lookup": {

            from: 'users',
            let: {
              'owner': "$calls.userId"
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $eq: ['$$owner', '$_id']
                  }
                }
              },
              {
                $project: {
                  "username": 1,
                  "phone": 1,
                  "image": 1
                }
              }
            ],
            "as": "owner"
          }
        },
        // Unwind the result arrays ( likely one or none )
        {
          "$unwind": "$owner"
        },
        // Group back to arrays
        {
          "$group": {
            "_id": "$_id",
            "calls": {
              "$push": {
                call: "$calls",
                owner: "$owner"
              }
            }
          }
        }
      ]).exec((err, users) => {


        if (err || !users) {
          reject(new Error('failed loading users ' + err));
          return callback(new Error('failed loading users ' + err));
        }
        let calls = [];
        users.map((user) => {
          user.calls.map((callObj) => {
            let item = callObj.call;
            item.callId = callObj.call._id;
            item.call_from = callObj.call.userId;
            item.date = callObj.call.created;
            item.callType = callObj.call.type;
            item.owner = callObj.owner;


            delete item._id;
            delete item.created;
            delete item.deleted;
            delete item.type;
            delete item.duration;
            delete item.userId;
            delete item.sent;
            delete item.seen;
            delete item.users;

            calls.push(item);


          });
          delete user._id;
        });

        resolve(calls);
        return callback(null, calls);
      });
    });
  };




  /**
   * @name _seenCalls
   * @function
   * @desc get a seen  calls
   * @param {object} options story options
   * @return {array} the function return array
   */
  let _seenCalls = (options, callback) => {
    callback = callback || function () {};

    let callId = options.callId;

    return new Promise((resolve, reject) => {
      userSchema.aggregate([{
          $match: {
            $and: [{
              _id: {
                $eq: ObjectID(options.userId)
              }
            }]

          }
        }, {
          "$addFields": {

            calls: {
              $filter: {
                input: '$calls',
                as: 'call',
                "cond": {
                  "$and": [{
                      "$eq": [ObjectID(options.userId), "$$call.userId"]
                    },
                    {
                      "$eq": [{
                          "$size": {
                            "$setIntersection": ["$$call.seen"]
                          }
                        },
                        1
                      ]
                    },
                    {
                      "$ne": [true, "$$call.deleted"]
                    }
                  ]
                }
              }
            }
          }
        },
        // Unwind the source
        {
          "$unwind": "$calls"
        },
        // Do the lookup matching
        {
          "$lookup": {

            from: 'users',
            let: {
              'owner': "$calls.userId"
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $eq: ['$$owner', '$_id']
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
            "as": "owner"
          }
        },
        // Unwind the result arrays ( likely one or none )
        {
          "$unwind": "$owner"
        },
        // Group back to arrays
        {
          "$group": {
            "_id": "$_id",
            "calls": {
              "$push": {
                call: "$calls",
                owner: "$owner"
              }
            }
          }
        }
      ]).exec((err, users) => {


        if (err || !users) {
          reject(new Error('failed loading users ' + err));
          return callback(new Error('failed loading users ' + err));
        }
        let calls = [];
        users.map((user) => {
          user.calls.map((callObj) => {

            let item = callObj.call;



            delete item.deleted;
            delete item.sent;
            delete item.users;

            calls.push(item);


          });
          delete user._id;
        });
        resolve(calls);
        return callback(null, calls);
      });
    });
  };

  /**
   * @name _makeCallExistAsFinished
   * @function
   * @desc set a call as finished if sender remove the call
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeCallExistAsFinished = (options, callback) => {
    callback = callback || function () {};

    let callId = options.callId;

    let query = {
      'calls._id': callId
    };
    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, userFetched) => {
          if (err || !userFetched) {
            let response = {
              success: false,
              message: 'Couldn\'t load the call'
            }
            reject(response);
            return callback(response);
          } else {

            let callObj = userFetched.calls.id(callId);
            if (!callObj) {
              let error = new Error('call not found!');
              let response = {
                success: false,
                message: 'call not found!'
              }
              reject(response);
              return callback(response);
            } else {
              if (callObj._id.toString() !== callId.toString()) {
                let error = new Error('Authorization is failed!');

                let response = {
                  success: false,
                  message: 'Authorization is failed!'
                }
                reject(response);
                return callback(response);
              }



              callObj.seen = [];
              callObj.sent = [];
              userFetched.save((err) => {
                if (err) {

                  let response = {
                    success: false,
                    message: 'Failed to set  call as finished  please try again later'
                  }
                  resolve(response);
                  return callback(null, response);
                }

                let response = {
                  success: true,
                  message: 'You made the call as finished successfully.'
                }
                resolve(response);
                return callback(null, response);
              });
            }

          }
        });
    });
  };

  /**
   * @name _makeCallAsFinished
   * @function
   * @desc set a call as finished
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeCallAsFinished = (options, callback) => {
    callback = callback || function () {};

    let callId = options.callId;

    let userId = options.userId;
    let query = {
      'calls._id': callId
    };
    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, userFetched) => {
          if (err || !userFetched) {
            let response = {
              success: false,
              message: 'Couldn\'t load the call'
            }
            reject(response);
            return callback(response);
          } else {

            let callObj = userFetched.calls.id(callId);
            if (!callObj) {
              let error = new Error('story not found!');
              let response = {
                success: false,
                message: 'call not found!'
              }
              reject(response);
              return callback(response);
            } else {
              if (callObj._id.toString() !== callId.toString()) {
                let error = new Error('Authorization is failed!');

                let response = {
                  success: false,
                  message: 'Authorization is failed!'
                }
                reject(response);
                return callback(response);
              }

              let sentArray = _.pluck(callObj.sent, '_id');
              sentArray = sentArray.map((sentId) => {
                return sentId.toString();
              });
              var sent = _.contains(sentArray, userId);
              if (sent) {
                callObj.sent.remove(userId);
              }


              let seenArray = _.pluck(callObj.seen, '_id');
              seenArray = seenArray.map((seenId) => {
                return seenId.toString();
              });
              var seen = _.contains(seenArray, userId);
              if (seen) {
                callObj.seen.remove(userId);
              }
              userFetched.save((err) => {
                if (err) {
                  reject(new Error('Failed to set  call as finished  please try again later'));
                  return callback(new Error('Failed to set  call as finished  please try again later'));
                }

                let response = {
                  success: true,
                  message: 'You made the call as finished successfully.'
                }
                resolve(response);
                return callback(null, response);
              });
            }

          }
        });
    });
  };

  /**
   * @name _makeCallAsSeen
   * @function
   * @desc set a call as seen
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeCallAsSeen = (options, callback) => {
    callback = callback || function () {};

    let callId = options.callId;

    let userId = options.userId;
    let query = {
      'calls._id': callId
    };

    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, userFetched) => {
          if (err || !userFetched) {
            let response = {
              success: false,
              message: 'Couldn\'t load the call'
            }
            reject(response);
            return callback(response);
          } else {

            let callObj = userFetched.calls.id(callId);
            if (!callObj) {
              let error = new Error('call not found!');
              let response = {
                success: false,
                message: 'call not found!'
              }
              reject(response);
              return callback(response);
            } else {
              if (callObj._id.toString() !== callId.toString()) {
                let error = new Error('Authorization is failed!');

                let response = {
                  success: false,
                  message: 'Authorization is failed!'
                }
                reject(response);
                return callback(response);
              }

              let sentArray = _.pluck(callObj.sent, '_id');
              sentArray = sentArray.map((sentId) => {
                return sentId.toString();
              });
              var sent = _.contains(sentArray, userId);
              if (sent) {
                callObj.sent.remove(userId);
              }


              let seenArray = _.pluck(callObj.seen, '_id');
              seenArray = seenArray.map((seenId) => {
                return seenId.toString();
              });
              var seen = _.contains(seenArray, userId);
              if (!seen) {
                callObj.seen.push(userId);
              }
              userFetched.save((err) => {
                if (err) {
                  reject(new Error('Failed to set  call as seen  please try again later'));
                  return callback(new Error('Failed to set  call as seen  please try again later'));
                }

                let response = {
                  success: true,
                  message: 'You made the call as seen successfully.'
                }
                resolve(response);
                return callback(null, response);
              });
            }

          }
        });
    });
  };
  /********************************************************************************************************************************************
   * ********************************************************************    Stories functions ************************************************
   * ******************************************************************************************************************************************/



  /**
   * @name _createStory
   * @function
   * @desc create new Story
   * @param {object} options  user options
   * @return {object} the function return sotry object
   */
  let _createStory = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      userSchema.findById(options.user._id)
        .select('stories')
        .exec((err, userFetched) => {
          if (err) {
            reject(new Error('Oops something went wrong'));
            return callback(new Error('Oops something went wrong'));
          }

          let story = {
            userId: options.user._id,
            users: options.body.ids,
          };
          if (!options.body.body && !options.body.file) {
            reject(new Error('You can\'t create an empty story'));
            return callback(new Error('You can\'t create an empty story'));
          }
          if (options.body.body) {
            story.body = options.body.body;
          }
          if (options.body.created) {
            story.created = options.body.created;
          }

          if (options.body.file) {
            story.file = options.body.file;
          }
          if (options.body.type) {
            story.type = options.body.type;
          }
          if (options.body.duration) {
            story.duration = options.body.duration;
          }
          story.sent = options.body.ids;
          userFetched.stories.push(story);
          userFetched.save((err, userInserted) => {
            if (err) {
              var storyData = {
                success: false,
                message: 'Couldn\'t save your story please try again later' + err,
                storyId: null
              }
              reject(storyData);
              return callback(storyData);
            }

            var storyData = {
              success: true,
              message: 'The story is created successfully.',
              storyId: userInserted.stories[userInserted.stories.length - 1]._id
            }

            resolve(storyData);
            return callback(null, storyData);



          });

        });
    });
  };




  /**
   * @name _deleteStory
   * @function
   * @desc set a deleted as deleted
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _deleteStory = (options, callback) => {
    callback = callback || function () {};

    let storyId = options.storyId;

    let query = {
      'stories._id': storyId
    };
    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .exec((err, user) => {
          if (err || !user) {
            let response = {
              success: false,
              message: 'Couldn\'t load the story'
            }
            reject(response);
            return callback(response);
          } else {

            let storyObj = user.stories.id(storyId);
            if (!storyObj) {
              let error = new Error('story not found!');
              let response = {
                success: false,
                message: 'story not found!'
              }
              reject(response);
              return callback(response);
            } else {
              if (storyObj._id.toString() !== storyId.toString()) {
                let error = new Error('Authorization is failed!');

                let response = {
                  success: false,
                  message: 'Authorization is failed!'
                }
                reject(response);
                return callback(response);
              }
              if (storyObj.deleted) {

                let response = {
                  success: true,
                  message: 'This story is already deleted !'
                }
                reject(response);
                return callback(response);
              }

              storyObj.deleted = true;

              user.save((err) => {
                if (err) {
                  let response = {
                    success: false,
                    message: 'Failed to set  story as deleted  please try again later!'
                  }
                  reject(response);
                  return callback(response);
                }

                let response = {
                  success: true,
                  message: 'The story is deleted successfully.'
                }
                resolve(response);
                return callback(null, response);
              });
            }

          }
        });
    });
  };

  /**
   * @name _myUnSentUserStories
   * @function
   * @desc get myusent unsent  stories
   * @param {object} options story options
   * @return {array} the function return array
   */
  let _myUnSentUserStories = (options, callback) => {
    callback = callback || function () {};

    let storyId = options.storyId;

    return new Promise((resolve, reject) => {
      userSchema.aggregate([{
        $match: {
              _id:   ObjectID(options.userId)
        }
        }, {
          "$addFields": {

            stories: {
              $filter: {
                input: '$stories',
                as: 'story',
                "cond": {
                  "$and": [
                    {
                      "$eq": [ObjectID(storyId), "$$story._id"] 
                    },
                    {
                      "$gte": [{
                        "$size": {
                          "$setIntersection": ["$$story.sent"]
                        }
                      },
                      1
                    ]
                    },
                    
                    {
                      "$ne": [true, "$$story.deleted"]
                    },
                    {
                      "$gte": ["$$story.created", new Date(new Date().setDate(new Date().getDate() - 1))]
                    }


                  ]
                }
              }
            }
          }
        },
        // Unwind the source
        {
          "$unwind": "$stories"
        },
        // Do the lookup matching
        {
          "$lookup": {

            from: 'users',
            let: {
              'owner': "$stories.userId"
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $eq: ['$$owner', '$_id']
                  }
                }
              },
              {
                $project: {
                  "username": 1,
                  "phone": 1,
                  "image": 1
                }
              }
            ],
            "as": "owner"
          }
        },
        // Unwind the result arrays ( likely one or none )
        {
          "$unwind": "$owner"
        },
        // Group back to arrays
        {
          "$group": {
            "_id": "$_id",
            "stories": {
              "$push": {
                story: "$stories",
                owner: "$owner"
              }
            }
          }
        }
      ]).exec((err, users) => {


        if (err || !users) {
          reject(new Error('failed loading users ' + err));
          return callback(new Error('failed loading users ' + err));
        }
        let stories = [];
        users.map((user) => {
          user.stories.map((storyObj) => {
            let item = storyObj.story;
            //  let owner = storyObj.owner;
            item._id = storyObj.story._id;
            item.body = storyObj.story.body;
            item.created = storyObj.story.created;
            item.storyOwnerId = storyObj.story.userId;
            item.file = storyObj.story.file;
            item.file_type = storyObj.story.type;
            item.duration_file = storyObj.story.duration;
            item.owner = storyObj.owner;





            delete item.deleted;
            delete item.type;
            delete item.duration;
            delete item.userId; 
            delete item.seen;
            delete item.users;
            delete item.expired;

            stories.push(item);


          });
          delete user._id;
        });

        resolve(stories);
        return callback(null, stories);
      });
    });
  };

  /**
   * @name _unSentUserStories
   * @function
   * @desc get a unsent  stories
   * @param {object} options story options
   * @return {array} the function return array
   */
  let _unSentUserStories = (options, callback) => {
    callback = callback || function () {};

    let storyId = options.storyId;

    return new Promise((resolve, reject) => {
      userSchema.aggregate([{
          $match: {
            $and: [{
              _id: {
                $ne: [ObjectID(options.userId)]
              }
            }]

          }
        }, {
          "$addFields": {

            stories: {
              $filter: {
                input: '$stories',
                as: 'story',
                "cond": {
                  "$and": [{
                      "$in": [ObjectID(options.userId), "$$story.users"]
                    },
                    {
                      "$in": [ObjectID(options.userId), "$$story.sent"]
                    },
                    {
                      "$ne": [true, "$$story.deleted"]
                    },
                    {
                      "$gte": ["$$story.created", new Date(new Date().setDate(new Date().getDate() - 1))]
                    }


                  ]
                }
              }
            }
          }
        },
        // Unwind the source
        {
          "$unwind": "$stories"
        },
        // Do the lookup matching
        {
          "$lookup": {

            from: 'users',
            let: {
              'owner': "$stories.userId"
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $eq: ['$$owner', '$_id']
                  }
                }
              },
              {
                $project: {
                  "username": 1,
                  "phone": 1,
                  "image": 1
                }
              }
            ],
            "as": "owner"
          }
        },
        // Unwind the result arrays ( likely one or none )
        {
          "$unwind": "$owner"
        },
        // Group back to arrays
        {
          "$group": {
            "_id": "$_id",
            "stories": {
              "$push": {
                story: "$stories",
                owner: "$owner"
              }
            }
          }
        }
      ]).exec((err, users) => {


        if (err || !users) {
          reject(new Error('failed loading users ' + err));
          return callback(new Error('failed loading users ' + err));
        }
        let stories = [];
        users.map((user) => {
          user.stories.map((storyObj) => {
            let item = storyObj.story;
            //  let owner = storyObj.owner;
            item._id = storyObj.story._id;
            item.body = storyObj.story.body;
            item.created = storyObj.story.created;
            item.storyOwnerId = storyObj.story.userId;
            item.file = storyObj.story.file;
            item.file_type = storyObj.story.type;
            item.duration_file = storyObj.story.duration;
            item.owner = storyObj.owner;





            delete item.deleted;
            delete item.type;
            delete item.duration;
            delete item.userId;
            delete item.sent;
            delete item.seen;
            delete item.users;
            delete item.expired;

            stories.push(item);


          });
          delete user._id;
        });

        resolve(stories);
        return callback(null, stories);
      });
    });
  };



  /**
   * @name _myExpiredStories
   * @function
   * @desc get a my expired  stories
   * @param {object} options story options
   * @return {array} the function return array
   */
  let _myExpiredStories = (options, callback) => {
    callback = callback || function () {};

    let storyId = options.storyId;

    return new Promise((resolve, reject) => {
      userSchema.aggregate([{
          $match: {
            $and: [{
              _id: {
                $eq: ObjectID(options.userId)
              }
            }]

          }
        }, {
          "$addFields": {

            stories: {
              $filter: {
                input: '$stories',
                as: 'story',
                "cond": {
                  "$and": [{
                      "$eq": [ObjectID(options.userId), "$$story.userId"]
                    },
                    {
                      "$ne": [true, "$$story.deleted"]
                    },
                    {
                      "$lt": ["$$story.created", new Date(new Date().setDate(new Date().getDate() - 1))]
                    }

                  ]
                }
              }
            }
          }
        },
        // Unwind the source
        {
          "$unwind": "$stories"
        },
        // Do the lookup matching
        {
          "$lookup": {

            from: 'users',
            let: {
              'owner': "$stories.userId"
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $eq: ['$$owner', '$_id']
                  }
                }
              },
              {
                $project: {
                  "username": 1,
                  "phone": 1,
                  "image": 1
                }
              }
            ],
            "as": "owner"
          }
        },
        // Unwind the result arrays ( likely one or none )
        {
          "$unwind": "$owner"
        },
        // Group back to arrays
        {
          "$group": {
            "_id": "$_id",
            "stories": {
              "$push": {
                story: "$stories",
                owner: "$owner"
              }
            }
          }
        }
      ]).exec((err, users) => {


        if (err || !users) {
          reject(new Error('failed loading users ' + err));
          return callback(new Error('failed loading users ' + err));
        }
        let stories = [];
        users.map((user) => {
          user.stories.map((storyObj) => {
            let item = storyObj.story;
            item._id = storyObj.story._id;
            item.owner = storyObj.owner;



            delete item.deleted;
            delete item.created;
            delete item.file;
            delete item.body;
            delete item.type;
            delete item.duration;
            delete item.userId;
            delete item.sent;
            delete item.seen;
            delete item.expired;
            delete item.users;

            stories.push(item);


          });
          delete user._id;
        });

        resolve(stories);
        return callback(null, stories);
      });
    });
  };
  /**
   * @name _expiredStories
   * @function
   * @desc get a expired  stories
   * @param {object} options story options
   * @return {array} the function return array
   */
  let _expiredStories = (options, callback) => {
    callback = callback || function () {};

    let storyId = options.storyId;

    return new Promise((resolve, reject) => {
      userSchema.aggregate([{
          $match: {
            $and: [{
              _id: {
                $ne: [ObjectID(options.userId)]
              }
            }]

          }
        }, {
          "$addFields": {

            stories: {
              $filter: {
                input: '$stories',
                as: 'story',
                "cond": {

                  "$and": [{
                    "$in": [ObjectID(options.userId), "$$story.users"]
                  }, {
                    "$not": [{
                      "$in": [ObjectID(options.userId), "$$story.expired"]
                    }]
                  }, {
                    "$or": [{
                      "$lt": ["$$story.created", new Date(new Date().setDate(new Date().getDate() - 1))]
                    }, {
                      "$eq": [true, "$$story.deleted"]
                    }]
                  }]
                }
              }
            }
          }
        },
        // Unwind the source
        {
          "$unwind": "$stories"
        },
        // Do the lookup matching
        {
          "$lookup": {

            from: 'users',
            let: {
              'owner': "$stories.userId"
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $eq: ['$$owner', '$_id']
                  }
                }
              },
              {
                $project: {
                  "username": 1,
                  "phone": 1,
                  "image": 1
                }
              }
            ],
            "as": "owner"
          }
        },
        // Unwind the result arrays ( likely one or none )
        {
          "$unwind": "$owner"
        },
        // Group back to arrays
        {
          "$group": {
            "_id": "$_id",
            "stories": {
              "$push": {
                story: "$stories",
                owner: "$owner"
              }
            }
          }
        }
      ]).exec((err, users) => {


        if (err || !users) {
          reject(new Error('failed loading users ' + err));
          return callback(new Error('failed loading users ' + err));
        }
        let stories = [];
        users.map((user) => {
          user.stories.map((storyObj) => {
            let item = storyObj.story;
            item._id = storyObj.story._id;
            item.owner = storyObj.owner;



            delete item.deleted;
            delete item.created;
            delete item.file;
            delete item.body;
            delete item.type;
            delete item.duration;
            delete item.userId;
            delete item.sent;
            delete item.seen;
            delete item.expired;
            delete item.users;

            stories.push(item);


          });
          delete user._id;
        });

        resolve(stories);
        return callback(null, stories);
      });
    });
  };


  /**
   * @name _makeStoryAsExpired
   * @function
   * @desc set a story as expired
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeStoryAsExpired = (options, callback) => {
    callback = callback || function () {};

    let storyId = options.storyId;
    let userId = options.userId;

    let query = {
      'stories._id': storyId
    };
    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, userFetched) => {
          if (err || !userFetched) {
            let response = {
              success: false,
              message: 'Couldn\'t load the story'
            }
            reject(response);
            return callback(response);
          } else {

            let storyObj = userFetched.stories.id(storyId);
            if (!storyObj) {
              let error = new Error('story not found!');
              let response = {
                success: false,
                message: 'story not found!'
              }
              reject(response);
              return callback(response);
            } else {
              if (storyObj._id.toString() !== storyId.toString()) {
                let error = new Error('Authorization is failed!');

                let response = {
                  success: false,
                  message: 'Authorization is failed!'
                }
                reject(response);
                return callback(response);
              }



              let expiredArray = _.pluck(storyObj.expired, '_id');
              expiredArray = expiredArray.map((expiredId) => {
                return expiredId.toString();
              });
              var expired = _.contains(expiredArray, userId);

              if (!expired) {
                if (Array.isArray(storyObj.expired)) {
                  storyObj.expired.push(userId);
                } else {
                  storyObj.expired = [userId];
                }

              }
              userFetched.save((err) => {
                if (err) {
                  reject(new Error('Failed to set  story as expired  please try again later'));
                  return callback(new Error('Failed to set  story as expired  please try again later'));
                }

                let response = {
                  success: true,
                  message: 'You made the story as expired successfully.'
                }
                resolve(response);
                return callback(null, response);
              });
            }

          }
        });
    });
  };


  /**
   * @name _seenStories
   * @function
   * @desc get a seen  stories
   * @param {object} options story options
   * @return {array} the function return array
   */
  let _seenStories = (options, callback) => {
    callback = callback || function () {};

    let storyId = options.storyId;

    return new Promise((resolve, reject) => {
      userSchema.aggregate([{
          $match: {
            $and: [{
              _id: {
                $eq: ObjectID(options.userId)
              }
            }]

          }
        }, {
          "$addFields": {

            stories: {
              $filter: {
                input: '$stories',
                as: 'story',
                "cond": {
                  "$and": [{
                      "$eq": [ObjectID(options.userId), "$$story.userId"]
                    },
                    {
                      "$eq": [{
                          "$size": {
                            "$setIntersection": ["$$story.seen"]
                          }
                        },
                        1
                      ]
                    },
                    {
                      "$ne": [true, "$$story.deleted"]
                    },
                    {
                      "$gte": ["$$story.created", new Date(new Date().setDate(new Date().getDate() - 1))]
                    }
                  ]
                }
              }
            }
          }
        },
        // Unwind the source
        {
          "$unwind": "$stories"
        },
        // Do the lookup matching
        {
          "$lookup": {

            from: 'users',
            let: {
              'owner': "$stories.userId"
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $eq: ['$$owner', '$_id']
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
            "as": "owner"
          }
        },
        // Unwind the result arrays ( likely one or none )
        {
          "$unwind": "$owner"
        },
        // Group back to arrays
        {
          "$group": {
            "_id": "$_id",
            "stories": {
              "$push": {
                story: "$stories",
                owner: "$owner"
              }
            }
          }
        }
      ]).exec((err, users) => {


        if (err || !users) {
          reject(new Error('failed loading users ' + err));
          return callback(new Error('failed loading users ' + err));
        }
        let stories = [];
        users.map((user) => {
          user.stories.map((storyObj) => {

            let item = storyObj.story;



            delete item.deleted;
            delete item.sent;
            delete item.users;
            delete item.expired;

            stories.push(item);


          });
          delete user._id;
        });
        resolve(stories);
        return callback(null, stories);
      });
    });
  };

  /**
   * @name _makeStoryExistAsFinished
   * @function
   * @desc set a story as finished if sender remove the story
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeStoryExistAsFinished = (options, callback) => {
    callback = callback || function () {};

    let storyId = options.storyId;

    let query = {
      'stories._id': storyId
    };
    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, userFetched) => {
          if (err || !userFetched) {
            let response = {
              success: false,
              message: 'Couldn\'t load the story'
            }
            reject(response);
            return callback(response);
          } else {

            let storyObj = userFetched.stories.id(storyId);
            if (!storyObj) {
              let error = new Error('story not found!');
              let response = {
                success: false,
                message: 'story not found!'
              }
              reject(response);
              return callback(response);
            } else {
              if (storyObj._id.toString() !== storyId.toString()) {
                let error = new Error('Authorization is failed!');

                let response = {
                  success: false,
                  message: 'Authorization is failed!'
                }
                reject(response);
                return callback(response);
              }



              storyObj.seen = [];
              userFetched.save((err) => {
                if (err) {
                  reject(new Error('Failed to set  story as finished  please try again later'));
                  return callback(new Error('Failed to set  story as finished  please try again later'));
                }

                let response = {
                  success: true,
                  message: 'You made the story as finished successfully.'
                }
                resolve(response);
                return callback(null, response);
              });
            }

          }
        });
    });
  };

  /**
   * @name _makeStoryAsFinished
   * @function
   * @desc set a story as finished
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeStoryAsFinished = (options, callback) => {
    callback = callback || function () {};

    let storyId = options.storyId;

    let userId = options.userId;
    let query = {
      'stories._id': storyId
    };
    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, userFetched) => {
          if (err || !userFetched) {
            let response = {
              success: false,
              message: 'Couldn\'t load the story'
            }
            reject(response);
            return callback(response);
          } else {

            let storyObj = userFetched.stories.id(storyId);
            if (!storyObj) {
              let error = new Error('story not found!');
              let response = {
                success: false,
                message: 'story not found!'
              }
              reject(response);
              return callback(response);
            } else {
              if (storyObj._id.toString() !== storyId.toString()) {
                let error = new Error('Authorization is failed!');

                let response = {
                  success: false,
                  message: 'Authorization is failed!'
                }
                reject(response);
                return callback(response);
              }

              let sentArray = _.pluck(storyObj.sent, '_id');
              sentArray = sentArray.map((sentId) => {
                return sentId.toString();
              });
              var sent = _.contains(sentArray, userId);
              if (sent) {

                if (Array.isArray(storyObj.sent)) {
                  storyObj.sent.remove(userId);
                } else {
                  storyObj.sent = [];
                }
              }


              let seenArray = _.pluck(storyObj.seen, '_id');
              seenArray = seenArray.map((seenId) => {
                return seenId.toString();
              });
              var seen = _.contains(seenArray, userId);
              if (seen) {
                if (Array.isArray(storyObj.seen)) {
                  storyObj.seen.remove(userId);
                } else {
                  storyObj.seen = [];
                }
              }
              userFetched.save((err) => {
                if (err) {
                  reject(new Error('Failed to set  story as finished  please try again later'));
                  return callback(new Error('Failed to set  story as finished  please try again later'));
                }

                let response = {
                  success: true,
                  message: 'You made the story as finished successfully.'
                }
                resolve(response);
                return callback(null, response);
              });
            }

          }
        });
    });
  };

  /**
   * @name _makeStoryAsSeen
   * @function
   * @desc set a story as seen
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeStoryAsSeen = (options, callback) => {
    callback = callback || function () {};

    let storyId = options.storyId;

    let userId = options.userId;
    let query = {
      'stories._id': storyId
    };

    return new Promise((resolve, reject) => {
      userSchema.findOne(query)
        .select('-auth_token')
        .exec((err, userFetched) => {
          if (err || !userFetched) {
            let response = {
              success: false,
              message: 'Couldn\'t load the story'
            }
            reject(response);
            return callback(response);
          } else {

            let storyObj = userFetched.stories.id(storyId);
            if (!storyObj) {
              let error = new Error('story not found!');
              let response = {
                success: false,
                message: 'story not found!'
              }
              reject(response);
              return callback(response);
            } else {
              if (storyObj._id.toString() !== storyId.toString()) {
                let error = new Error('Authorization is failed!');

                let response = {
                  success: false,
                  message: 'Authorization is failed!'
                }
                reject(response);
                return callback(response);
              }

              let sentArray = _.pluck(storyObj.sent, '_id');
              sentArray = sentArray.map((sentId) => {
                return sentId.toString();
              });
              var sent = _.contains(sentArray, userId);
              if (sent) {
                if (Array.isArray(storyObj.sent)) {
                  storyObj.sent.remove(userId);
                } else {
                  storyObj.sent = [];
                }
              }


              let seenArray = _.pluck(storyObj.seen, '_id');
              seenArray = seenArray.map((seenId) => {
                return seenId.toString();
              });
              var seen = _.contains(seenArray, userId);
              if (!seen) {
                if (Array.isArray(storyObj.seen)) {
                  storyObj.seen.push(userId);
                } else {
                  storyObj.seen = [userId];
                }
              }
              userFetched.save((err) => {
                if (err) {
                  reject(new Error('Failed to set  story as seen  please try again later'));
                  return callback(new Error('Failed to set  story as seen  please try again later'));
                }

                let response = {
                  success: true,
                  message: 'You made the story as seen successfully.'
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
    comparePhoneNumbers: _comparePhoneNumbers,
    getUser: _getUser,
    getUserBySocketID: _getUserBySocketID,
    unBlockUser: _unBlockUser,
    blockUser: _blockUser,
    editName: _editName,
    editUserState: _editUserState,
    editImage: _editImage,
    addStatus: _addStatus,
    getStatus: _getStatus,
    deleteStatus: _deleteStatus,
    deleteAllStatus: _deleteAllStatus,
    setCurrentStatus: _setCurrentStatus,
    getSettings: _getSettings,
    saveNewCall: _saveNewCall,
    unSentUserCalls: _unSentUserCalls,
    seenCalls: _seenCalls,
    makeCallAsSeen: _makeCallAsSeen,
    makeCallAsFinished: _makeCallAsFinished,
    makeCallExistAsFinished: _makeCallExistAsFinished,
    createStory: _createStory,
    deleteStory: _deleteStory,
    myUnSentUserStories:_myUnSentUserStories,
    unSentUserStories: _unSentUserStories,
    expiredStories: _expiredStories,
    myExpiredStories: _myExpiredStories,
    makeStoryAsExpired: _makeStoryAsExpired,
    seenStories: _seenStories,
    makeStoryAsSeen: _makeStoryAsSeen,
    makeStoryAsFinished: _makeStoryAsFinished,
    makeStoryExistAsFinished: _makeStoryExistAsFinished

  };

})();
module.exports = usersQueries;