/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:51:13 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-05-18 22:58:22
 */

'use strict';

const Admin = require('../../../../models/admins');
const settings = require('../../../../models/settings');
const users = require('../../../../models/users');
const groups = require('../../../../models/groups');
const chats = require('../../../../models/chats');
const _ = require('underscore');
const q = require('q');

/** @module AppAdmin/AdminsQueries */
module.exports = (function () {


  /**
   * @name _create_account
   * @function
   * @desc create new account
   * @param {object} options account options
   * @return {object} the function return response
   */
  /*let _create_account = (options, callback) => {
    callback = callback || function() {};

    return new Promise((resolve, reject) => {



      var data = {
        email: options.email,
        username: options.username
      };
      Admin.findOne(data).lean().exec(function(err, user) {
        if (err) {

          reject(new Error('Sorry! Error occurred While account creation . '));
          return callback(new Error('Sorry! Error occurred While account creation . '));
        } else {
          if (!user) {
            let admin = new Admin({
              username: options.username,
              email: options.email,
              password: options.password
            });
            // Attempt to save the new admin
            admin.save((err) => {

              if (err) {
                if (err.name == 'ValidationError') {
                  for (var field in err.errors) {
                    reject(new Error(err.errors[field].message));
                    return callback(new Error(err.errors[field].message));
                  }
                } else {
                  reject(new Error('Sorry! Error occurred While account creation . '));
                  return callback(new Error('Sorry! Error occurred While account creation . '));
                }
              } else {
                resolve(admin);
                return callback(null, admin);

              }
            });

          } else {
            reject(new Error('Sorry! Error occurred While account creation . '));
            return callback(new Error('Sorry! Error occurred While account creation . '));
          }
        }
      });

    });

  };*/

  /**
   * @name _init_settings
   * @function
   * @desc  initializer settings
   * @param {object} options account options
   * @return {object} the function return response
   */
  /*let _init_settings = (options, callback) => {
    callback = callback || function() {};

    return new Promise((resolve, reject) => {


      let setting_array = [{
        name: 'privacy_link',
        value: 'https://strolink.com/privacy_link'
      }, {
        name: 'app_name',
        value: 'WhatsUp'
      }, {
        name: 'giphy_key',
        value: 'put your giphy key here'
      }, {
        name: 'sms_fb_verification',
        value: 'off'
      }, {
        name: 'video_ads_app_id',
        value: 'put your Video app id of admob'
      }, {
        name: 'video_ads_status',
        value: 'off'
      }, {
        name: 'video_ads_unit_id',
        value: 'put your Video unit id of admob'
      }, {
        name: 'publisher_id',
        value: 'here your admob publisher  id '
      }, {
        name: 'app_version',
        value: '1'
      }, {
        name: 'sms_verification',
        value: 'on'
      }, {
        name: 'sms_authentication_key',
        value: 'put your SMS provider authentication key here'
      }, {
        name: 'interstitial_ads_status',
        value: 'off'
      }, {
        name: 'interstitial_ads_unit_id',
        value: 'put your Interstitial unit id of admob'
      }, {
        name: 'banner_ads_status',
        value: 'off'
      }, {
        name: 'banner_ads_unit_id',
        value: 'put your unit id of admob'
      }, {
        name: 'account_sid',
        value: 'put your SMS provider account SID here'
      }, {
        name: 'phone_number',
        value: 'put your SMS provider phone number here'
      }, {
        name: 'client_token',
        value: 'put your acount kit client token  here'
      }, {
        name: 'google_api_key',
        value: 'put your server google  key  here'
      }, {
        name: 'topic',
        value: 'put your package name  here'
      }];




      var promises = [];

      var deferred = q.defer(); //init promise


      _.forEach(setting_array, (object) => {
       
        var data = {
          name: object.name
        };
        settings.findOne(object).lean().exec(function(err, settingObj) {
          if (err) {

            reject(new Error('Sorry! Error occurred While setting creation . '));
            return callback(new Error('Sorry! Error occurred While setting creation . '));
          } else {
            if (!settingObj) {

              let setting = new settings(object);
              // Attempt to save the new settings
              setting.save((err) => {

                if (err) {
                  if (err.name == 'ValidationError') {
                    for (var field in err.errors) {
                      reject(new Error(err.errors[field].message));
                      return callback(new Error(err.errors[field].message));
                    }
                  } else {
                    reject(new Error('Sorry! Error occurred While initial setting . '));
                    return callback(new Error('Sorry! Error occurred While initial setting  . '));
                  }
                } else {
                  deferred.resolve(setting); // resolve the promise
                }

              });
              promises.push(deferred.promise); // add promise to array, can be rejected or   fulfilled
            } else {

              reject(new Error('Sorry! Error occurred While initial setting . '));
              return callback(new Error('Sorry! Error occurred While initial setting  . '));
            }
          }
        });
      });


      q.all(promises).then(function(result) {

       
        resolve(result[0]);
        return callback(null, result[0]);
      });
    });

  };*/
  /**
   * @name _getSetting
   * @function
   * @param {object} options account options
   * @desc getSetting
   * @return {object} the function return response
   */
  let _getSetting = (options, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {

      settings.findOne({
          name: options.name
        }).select('value -_id ')
        .exec((err, setting) => {
          if (err || !setting) {
            let error = new Error('setting not found!');
            reject(error);
            return callback(error);
          } else {
            resolve(setting);
            return callback(null, setting);
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


      settings.find({}).select(' -_id  -__v ')
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


  /**
   * @name _saveSettings
   * @function
   * @param {object} options account options
   * @desc  save Settings
   * @return {object} the function return response
   */
  let _saveSettings = (options, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {

      var promises = [];

      var deferred = q.defer(); //init promise
      for (var key in options) {

        var data = {
          value: options[key]
        };
        var criteria = {
          name: key
        };

        settings.findOneAndUpdate(criteria,
          data,
          function (err, setting) {

            if (err || !setting) {
              let responseError = {
                success: false,
                message: 'Failed to update settings plse try again later'
              }
              reject(responseError);
              return callback(responseError);
            } else {
              let response = {
                success: true,
                message: 'settings has been changed successfully.'
              }
              deferred.resolve(response); // resolve the promise
            }

          });
        promises.push(deferred.promise); // add promise to array, can be rejected or   fulfilled
      }

      q.all(promises).then(function (result) {


        resolve(result[0]);
        return callback(null, result[0]);
      });
    });

  };


  /**
   * @name _editAdmin
   * @function
   * @param {object} options account options
   * @desc  _edit Admin profile
   * @return {object} the function return response
   */
  let _editAdmin = (options, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {

      var criteria = {
        _id: options.userId
      };

      Admin.findById(criteria).then(function (user) {
        if (!user) {

          let responseError = {
            success: false,
            message: 'Error, This user is not exist please try again'
          };

          reject(responseError);
          return callback(responseError);
        } else if (!user.authenticate(options.old_admin_password)) {
          let responseError = {
            success: false,
            message: 'Error,the old  password is not correct please try again'
          };

          reject(responseError);
          return callback(responseError);
        } else {
          if (options.image != null) {
            user.image = options.image;
            user.password = options.password;
            user.username = options.username;
            user.email = options.email;
          } else {

            user.password = options.password;
            user.username = options.username;
            user.email = options.email;
          }

          user.save(function (err) {
            if (err) {
              let responseError = {
                success: false,
                message: 'Failed to update user plse try again later'
              }
              reject(responseError);
              return callback(responseError);
            }

            let response = {
              user: user,
              success: true,
              message: 'user has been changed successfully.'
            }
            resolve(response);
            return callback(null, response);
          });

        }
      }).catch((err) => {

        let responseError = {
          success: false,
          message: err.message
        };
        reject(responseError);
        return callback(responseError);
      });


    });

  };
  /**
   * @name _getAdmin
   * @function
   * @desc get single user information
   * @param {object} userId
   * @return {object} the function return user info
   *  @apiSuccessExample {json} Response-Example:
   */
  let _getAdmin = (options, callback) => {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {

      Admin.findOne({
          _id: options.userId
        }).select('_id username email image')
        .exec((err, user) => {
          if (err || !user) {
            let error = new Error('User not found!');
            reject(error);
            return callback(error);
          } else {
            resolve(user);
            return callback(null, user);
          }
        });
    });
  };
  /**
   * @name _usersCounter
   * @function
   * @desc usersCounter
   * @return {object} the function return response
   */
  let _usersCounter = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      users.countDocuments({})
        .exec((err, count) => {
          if (err) {
            reject(0);
            return callback(0);
          } else {
            resolve(count);
            return callback(null, count);
          }
        });

    });

  };
  /**
   * @name _groupsCounter
   * @function
   * @desc groupsCounter
   * @return {object} the function return response
   */
  let _groupsCounter = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      groups.countDocuments({})
        .exec((err, count) => {
          if (err) {
            reject(0);
            return callback(0);
          } else {
            resolve(count);
            return callback(null, count);
          }
        });

    });

  };
  /**
   * @name _chatsCounter
   * @function
   * @desc chatsCounter
   * @return {object} the function return response
   */
  let _chatsCounter = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      chats.countDocuments({})
        .exec((err, count) => {
          if (err) {
            reject(0);
            return callback(0);
          } else {
            resolve(count);
            return callback(null, count);
          }
        });

    });

  };
  /**
   * @name _lastUsers
   * @function
   * @desc lastUsers registered
   * @return {object} the fun ction return response
   */
  let _lastUsers = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      users.find({}).select("username phone image status").sort('-created').limit(8)
        .exec((err, users) => {
          if (err) {
            reject(0);
            return callback(0);
          } else {
            resolve(users);
            return callback(null, users);
          }
        });

    });

  };



  /**
   * @name _getUsersByCountry
   * @function
   * @desc get Users By Country registered
   * @return {object} the fun ction return response
   */
  let _getUsersByCountry = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      users.aggregate([{
          "$group": {
            _id: "$country",
            count: {
              $sum: 1
            }
          }
        }]).sort('-created')
        .exec((err, users_list) => {
          if (err) {
            reject(null);
            return callback(null);
          } else {



            var countriesData = [];
            _.forEach(users_list, (item) => {

              var data = {
                Country: item._id,
                Popularity: item.count
              }
              countriesData.push(data);
            });

            resolve(countriesData);
            return callback(null, countriesData);

          }
        });

    });

  };
  /**
   * @name _getUsers
   * @function
   * @desc getUsers registered
   * @return {object} the fun ction return response
   */
  let _getUsers = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      var perPage = 16
      var page = options.page || 1

      users.find({})
        .select("username phone image status country")
        .sort('-created')
        //.skip((perPage * page) - perPage)
        //.limit(perPage)
        .exec(function (err, users_list) {
          users.countDocuments().exec(function (err, count) {
            if (err) {
              reject(null);
              return callback(null);
            }
            var data = {
              users_list: users_list,
              current: page,
              pages: Math.ceil(count / perPage)
            }
            resolve(data);
            return callback(null, data);
          });
        });

    });

  };

  /**
   * @name _removeUser
   * @function
   * @desc remove a User
   * @return {object} the fun ction return response
   */
  let _removeUser = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {

      var userId = options.userId;

      users.findByIdAndDelete(userId)
        .exec(function (err, user) {
          if (err || !user) {
            reject(false);
            return callback(false);
          }
          resolve(true);
          return callback(null, true);

        });

    });

  };

  /**
   * @name _getChats
   * @function
   * @desc get chats
   * @return {object} the fun ction return response
   */
  let _getChats = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      var perPage = 15
      var page = options.page || 1
      chats.find({})
        //.select("username phone image status")
        .populate({
          path: 'users',
          select: 'username phone image country'
        }).populate({
          path: 'users',
          select: 'username phone image country '
        }).populate({
          path: 'groupId',
          select: 'name image '
        }).select('-__v ').sort({
          created: -1
        })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, chats_list) {
          chats.countDocuments().exec(function (err, count) {
            if (err) {
              reject(null);
              return callback(null);
            }

            var chats = [];
            chats_list.map((conversation) => {
              var chat;
              if (conversation.groupId != null) {
                chat = {
                  is_group: true,
                  owner: conversation.users[0],
                  group: conversation.groupId,
                  messages_counter: conversation.messages.length
                }
              } else {
                chat = {
                  is_group: false,
                  sender: conversation.users[0],
                  recipient: conversation.users[1],
                  messages_counter: conversation.messages.length
                }
              }
              chats.push(chat);
            });


            var data = {
              chats: chats,
              current: page,
              pages: Math.ceil(count / perPage)
            }
            resolve(data);
            return callback(null, data);
          });
        });

    });

  };

  /**
   * @name _getGroups
   * @function
   * @desc get Groups registered
   * @return {object} the fun ction return response
   */
  let _getGroups = (options, callback) => {
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      var perPage = 16
      var page = options.page || 1

      groups.find({})
        .select("name  image members")
        .sort('-created')
        // .skip((perPage * page) - perPage)
        // .limit(perPage)
        .exec(function (err, groups_list) {
          groups.countDocuments().exec(function (err, count) {
            if (err) {
              reject(null);
              return callback(null);
            }

            var groups_array = [];
            groups_list.map((group) => {
              var group_obj = {
                name: group.name,
                image: group.image,
                members_counter: group.members.length,
                _id: group._id
              }

              groups_array.push(group_obj);
            });


            var data = {
              groups: groups_array,
              current: page,
              pages: Math.ceil(count / perPage)
            }
            resolve(data);
            return callback(null, data);
          });
        });

    });

  };
  return {

    getSetting: _getSetting,
    getSettings: _getSettings,
    saveSettings: _saveSettings,
    chatsCounter: _chatsCounter,
    groupsCounter: _groupsCounter,
    usersCounter: _usersCounter,
    lastUsers: _lastUsers,
    getUsersByCountry: _getUsersByCountry,
    getUsers: _getUsers,
    removeUser: _removeUser,
    getChats: _getChats,
    getGroups: _getGroups,
    editAdmin: _editAdmin,
    getAdmin: _getAdmin
  };
})();