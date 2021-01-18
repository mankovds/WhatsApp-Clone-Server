/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:52:16 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-09-12 14:08:18
 */

'use strict';
const _ = require('underscore');
const groupSchema = require('../../../../models/groups');
const chatsModule = require('../../app-chat');

var mongo = require('mongodb'),
  ObjectID = mongo.ObjectID;



/** @module AppGroups/GroupsQueries */
let groupsQueries = (function() {


  /**
   * @name _createGroup
   * @function
   * @desc create a new group
   * @param {object} options group options
   * @return {object} the function return response
   */
  let _createGroup = (options, callback) => {
    callback = callback || function() {};
    let name = options.name;
    let userId = options.user._id;
    let image = options.image;
    let users_id = options.ids;
    let createTime = options.createTime;
    return new Promise((resolve, reject) => {

      let group = new groupSchema({
        name: name,
        userId: userId,
        image: image
      });
      // Attempt to save the new group
      group.save(function(err, groupInserted) {
        if (err) {
          reject(new Error('Sorry! Error occurred While group creation . '));
          return callback(new Error('Sorry! Error occurred While group creation . '));

        } else {
          //insert group members
          //
          _.forEach(users_id, (user_id) => {
            if (user_id == userId) {
              groupInserted.members.push({
                userId: user_id,
                groupId: groupInserted._id,
                admin: true
              });
            } else {
              groupInserted.members.push({
                userId: user_id,
                groupId: groupInserted._id,
                admin: false
              });

            }

          });

          groupInserted.save((err) => {
            if (err) {
              reject(new Error('Failed to add the user member please try again later'));
              return callback(new Error('Failed to add the user member  please try again later'));
            } else {

              let response = {
                success: true,
                message: 'Your group is created successfully .',
                groupId: groupInserted._id,
                groupImage: groupInserted.image,
                membersModels: groupInserted.members
              }
              resolve(response);
              return callback(null, response);
            }
          });

        }
      });
    });

  };

  /**
   * @name _addMembersToGroup
   * @function
   * @desc add new members to group
   * @param {object} options group options
   * @return {object} the function return response
   */
  let _addMembersToGroup = (options, callback) => {
    callback = callback || function() {};

    let userId = options.userId;
    let groupId = options.groupId;

    let query = {
      _id: groupId,
      'members._id': userId
    };
    return new Promise((resolve, reject) => {

      groupSchema.findOne({
          _id: groupId
        })
        .select('-auth_token')
        .exec((err, group) => {

          if (err || !group) {
            reject(new Error('Couldn\'t load the group'));
            return callback(new Error('Couldn\'t load the group'));
          }


          groupSchema.findOne(query)
            .select('-auth_token')
            .exec((err, group2) => {

              if (err) {
                reject(new Error('Couldn\'t load the group'));
                return callback(new Error('Couldn\'t load the group'));
              }


              if (!group2) {
                group.members.push({
                  _id: new ObjectID(),
                  userId: userId,
                  groupId: groupId,
                  admin: false
                });


                group.save((err) => {
                  if (err) {
                    reject(new Error('Failed to add the user member please try again later'));
                    return callback(new Error('Failed to add the user member  please try again later'));
                  }

                  let response = {
                    success: true,
                    message: 'Member(s)  has been added to group successfully..'
                  }
                  resolve(response);
                  return callback(null, response);
                });

              } else {
                reject(new Error('Failed to add the user member  ,is already exist , please try again later'));
                return callback(new Error('Failed to add the user member , is already exist,  please try again later'));
              }
            });


        });

    });


  };

  /**
   * @name _removeMemberFromGroup
   * @function
   * @desc remove  members from group
   * @param {object} options group options userid is memberId from the app
   * @return {object} the function return response
   */
  let _removeMemberFromGroup = (options, callback) => {
    callback = callback || function() {};

    let userId = options.userId;
    let groupId = options.groupId;

    return new Promise((resolve, reject) => {

      groupSchema.findOne({
          _id: groupId
        })
        .select('-auth_token')
        .exec((err, group) => {
          if (err || !group) {
            reject(new Error('Couldn\'t load the group'));
            return callback(new Error('Couldn\'t load the group'));
          }

          if (!group.members.id(userId)) {
            reject(new Error('Failed to remove the user member , is not  exist , please try again later'));
            return callback(new Error('Failed to add the user member , is not exist,  please try again later'));
          } else {
            group.members = _.without(group.members, group.members.id(userId));
            group.save((err) => {
              if (err) {
                reject(new Error('Failed to remove the user member please try again later'));
                return callback(new Error('Failed to remove the user member  please try again later'));
              }

              let response = {
                success: true,
                message: 'Member  has been removed from group successfully..'
              }
              resolve(response);
              return callback(null, response);
            });
          }
        });

    });


  };


  /**
   * @name _makeMemberAdmin
   * @function
   * @desc set a member  as admin
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeMemberAdmin = (options, callback) => {
    callback = callback || function() {};

    let userId = options.userId;
    let groupId = options.groupId;

    let query = {
      _id: groupId,
      'members._id': userId
    };
    return new Promise((resolve, reject) => {
      groupSchema.findOne(query)
        .select('-auth_token')
        .exec((err, group) => {
          if (err || !group) {
            reject(new Error('Couldn\'t load the group'));
            return callback(new Error('Couldn\'t load the group'));
          } else {
            let memberObj = group.members.id(userId);
            if (!memberObj) {
              let error = new Error('member not found!');
              reject(error);
              return callback(error);
            } else {
              if (memberObj.groupId.toString() !== groupId.toString()) {
                let error = new Error('Authorization is failed!');
                reject(error);
                return callback(error);
              }
              let dataObj = {
                admin: true
              }
              memberObj = _.extend(memberObj, dataObj);

              group.save((err) => {
                if (err) {
                  reject(new Error('Failed to set  member as admin  please try again later'));
                  return callback(new Error('Failed to set  member as admin  please try again later'));
                }

                let response = {
                  success: true,
                  message: 'You made the member as admin successfully.'
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
   * @name _makeAdminMember
   * @function
   * @desc set a admin  as member
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _makeAdminMember = (options, callback) => {
    callback = callback || function() {};

    let userId = options.userId;
    let groupId = options.groupId;

    let query = {
      _id: groupId,
      'members._id': userId
    };
    return new Promise((resolve, reject) => {
      groupSchema.findOne(query)
        .select('-auth_token')
        .exec((err, group) => {
          if (err || !group) {
            reject(new Error('Couldn\'t load the group'));
            return callback(new Error('Couldn\'t load the group'));
          } else {
            let memberObj = group.members.id(userId);
            if (!memberObj) {
              let error = new Error('member not found!');
              reject(error);
              return callback(error);
            } else {
              if (memberObj.groupId.toString() !== groupId.toString()) {
                let error = new Error('Authorization is failed!');
                reject(error);
                return callback(error);
              }
              let dataObj = {
                admin: false
              }
              memberObj = _.extend(memberObj, dataObj);

              group.save((err) => {
                if (err) {
                  reject(new Error('Failed to set  admin as member  please try again later'));
                  return callback(new Error('Failed to set  admin as member  please try again later'));
                }

                let response = {
                  success: true,
                  message: 'You made the admin as member successfully.'
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
   * @name _editGroupName
   * @function
   * @desc update group name
   * @param {object} options
   * @return {object} the function return response
   */
  let _editGroupName = (options, callback) => {
    callback = callback || function() {};
    let groupId = options.groupId;
    let data = {
      name: options.name
    }
    return new Promise((resolve, reject) => {
      groupSchema.findOneAndUpdate({
        _id: groupId
      }, data, {
        new: true
      }, function(err, group) {
        if (err || !group) {
          let responseError = {
            success: false,
            message: 'Failed to update group name plse try again later'
          }
          reject(responseError);
          return callback(responseError);
        } else {
          let response = {
            success: true,
            message: 'Group name is changed successfully.'
          }
          resolve(response);
          return callback(null, response);
        }

      });
    });
  };



  /**
   * @name _editGroupImage
   * @function
   * @desc update group image
   * @param {object} options
   * @return {object} the function return response
   */
  let _editGroupImage = (options, callback) => {
    callback = callback || function() {};
    let groupId = options.groupId;
    let data = {
      image: options.image
    }
    return new Promise((resolve, reject) => {
      groupSchema.findOneAndUpdate({
        _id: groupId
      }, data, {
        new: true
      }, function(err, group) {
        if (err || !group) {
          let responseError = {
            success: false,
            message: 'Failed to update group name plse try again later'
          }
          reject(responseError);
          return callback(responseError);
        } else {
          let response = {
            success: true,
            message: 'Group name is changed successfully.'
          }
          resolve(response);
          return callback(null, response);
        }

      });
    });
  };
  /**
   * @name _exitGroup
   * @function
   * @desc left group
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _exitGroup = (options, callback) => {
    callback = callback || function() {};

    let userId = options.userId;
    let groupId = options.groupId;



    let query = {
      _id: groupId
    };
    return new Promise((resolve, reject) => {

      groupSchema.findOne(query)
        .select('-auth_token ')
        .exec((err, group) => {

          let memberObj = group.members.id(userId);
          if (!memberObj) {
            let error = new Error('member not found!');
            reject(error);
            return callback(error);
          } else {
            if (memberObj.left == true) {
              reject(new Error('You are already lefted this group'));
              return callback(new Error('You are already lefted this group'));
            } else {
              if (memberObj.admin == true) {
                let memberArray = group.members;
                let memberIds = [];
                _.forEach(memberArray, (member) => {
                  if (member._id != userId) {
                    memberIds.push(member._id);
                  }
                });

                let memberId = random_item(memberIds);
                let memberObj = group.members.id(userId);
                let memberObjNew = group.members.id(memberId);


                let dataObjNew = {
                  left: false,
                  admin: true
                }
                memberObjNew = _.extend(memberObjNew, dataObjNew);

                let dataObj = {
                  left: true,
                  admin: false
                }
                memberObj = _.extend(memberObj, dataObj);


                group.save((err) => {
                  if (err) {
                    reject(new Error('Failed to left this group  please try again later'));
                    return callback(new Error('Failed to left this group please try again later'));
                  }

                  let response = {
                    success: true,
                    message: 'You lefted this group successfully'
                  }
                  resolve(response);
                  return callback(null, response);
                });
              } else {
                if (memberObj.groupId.toString() !== groupId.toString()) {
                  let error = new Error('Authorization is failed!');
                  reject(error);
                  return callback(error);
                }

                let dataObj = {
                  left: true
                }
                memberObj = _.extend(memberObj, dataObj);

                group.save((err) => {
                  if (err) {
                    reject(new Error('Failed to left this group  please try again later'));
                    return callback(new Error('Failed to left this group  please try again later'));
                  }

                  let response = {
                    success: true,
                    message: 'You lefted this group successfully'
                  }
                  resolve(response);
                  return callback(null, response);
                });
              }

            }
          }
        });
    });
  };

  function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];

  }
  /**
   * @name _deleteGroup
   * @function
   * @desc delete group
   * @param {object} options _id
   * @return {object} the function return response
   */
  let _deleteGroup = (options, callback) => {
    callback = callback || function() {};

    let userId = options.userId;
    let groupId = options.groupId;

    let query = {
      _id: groupId,
      'members._id': userId
    };
    return new Promise((resolve, reject) => {
      groupSchema.findOne(query)
        .select('-auth_token')
        .exec((err, group) => {
          if (err || !group) {
            reject(new Error('Couldn\'t load the group'));
            return callback(new Error('Couldn\'t load the group'));
          } else {
            let memberObj = group.members.id(userId);
            if (!memberObj) {
              let error = new Error('member not found!');
              reject(error);
              return callback(error);
            } else {
              if (memberObj.groupId.toString() !== groupId.toString()) {
                let error = new Error('Authorization is failed!');
                reject(error);
                return callback(error);
              }
              /*  if (memberObj.deleted) {
                  reject(new Error('You are already deleted this group'));
                  return callback(new Error('You are already deleted this group'));
                } else {*/


              chatsModule.chatQueries.deleteConversation({
                  user: options.user,
                  conversationId: options.conversationId
                })
                .then((message) => {
                  let dataObj = {
                    deleted: true
                  }
                  memberObj = _.extend(memberObj, dataObj);

                  group.save((err) => {
                    if (err) {
                      reject(new Error('Failed to delete this group  please try again later'));
                      return callback(new Error('Failed to delete this group  please try again later'));
                    }

                    let response = {
                      success: true,
                      message: 'You deleted this group successfully'
                    }
                    resolve(response);
                    return callback(null, response);
                  });
                })
                .catch((err) => {
                  if (err) {
                    reject(new Error('Failed to delete this group  please try again later'));
                    return callback(new Error('Failed to delete this group  please try again later'));
                  }
                });

              //}

            }

          }
        });
    });
  };


  /**
   * @name _getGroup
   * @function
   * @desc get single group information
   * @param {object} groupId
   * @return {object} the function return group info
   */
  let _getGroup = (options, callback) => {
    callback = callback || function() {};
    return new Promise((resolve, reject) => {
      var userData;
      groupSchema.findOne({
          _id: options.groupId
        }).populate({
          path: 'userId',
          select: 'username phone image activated status '
        }).populate({
          path: 'members.userId',
          select: 'username phone image activated status '
        }).select('-__v')
        .exec((err, group) => {

          if (err || !group) {
            let error = new Error('Group not found!');
            reject(error + " " + err);
            return callback(error + " " + err);
          } else {


            let status_user = [];
            let item = group.toObject();

            item.userId.status.map((status) => {
              if (status.current == true) {
                status_user.push(status);
              }
            });

            let members = [];
            item.members.map((member) => {
              let status_user2 = [];
              member.userId.status.map((status) => {
                if (status.current == true) {
                  status_user2.push(status);
                }
              });
              member.userId.status = status_user2[0]
              member.userId.linked = true;
              member.userId.exist = true;

              member.userId.activate = member.userId.activated;
              delete member.userId.activated;
              member.owner = member.userId;
              delete member.userId;
              members.push(member);
            });
            item.userId.status = status_user[0];
            item.userId.linked = true;
            item.userId.exist = true;
            item.userId.activate = item.userId.activated;
            delete item.userId.activated;
            item.owner = item.userId;

            delete item.userId;
            resolve(item);
            return callback(null, item);
          }
        });
    });
  };

  /**
   * @name _checkMemberGroup
   * @function
   * @desc check if user exist in group
   * @param {object} userId
   * @return {object} the function return group id
   */
  let _checkMemberGroup = (options, callback) => {
    callback = callback || function() {};
    return new Promise((resolve, reject) => {

      groupSchema.find({

          $and: [{
            members: {
              $elemMatch: {
                left: false,
                deleted: false,
                userId: options.userId
              }
            }
          }]
        }).select("_id ")
        .exec((err, groups) => {

          if (err || !groups) {
            let error = new Error('Group not found!');
            reject(error + " " + err);
            return callback(error + " " + err);
          } else {

            resolve(groups);
            return callback(null, groups);
          }
        });
    });
  };


  return {
    createGroup: _createGroup,
    addMembersToGroup: _addMembersToGroup,
    removeMemberFromGroup: _removeMemberFromGroup,
    makeMemberAdmin: _makeMemberAdmin,
    makeAdminMember: _makeAdminMember,
    editGroupName: _editGroupName,
    editGroupImage: _editGroupImage,
    exitGroup: _exitGroup,
    deleteGroup: _deleteGroup,
    getGroup: _getGroup,
    checkMemberGroup: _checkMemberGroup
  };

})();
module.exports = groupsQueries;