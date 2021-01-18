/*
 * @Author: Abderrahim El imame
 * @Date: 2019-05-18 22:55:47
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-12-20 14:43:13
 */

var express = require('express');
var router = express.Router();
var config_db = require('../config/config.js');
const adminModule = require('../api/routes/app-modules/app-admin');
var User = require('../api/models/admins');
var async = require('async');
const filesController = require('../api/controllers/filesController');

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {

  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/admin/dashboard');

  } else {


    next();
  }
};
// route for Home-Page
router.get('/admin', sessionChecker, (req, res) => {
  res.redirect('/admin/login');
});


// route for user Login
router.get('/admin/login', sessionChecker, (req, res) => {
  res.render('admin/login', {
    success: false,
    message: null
  });

});
router.post('/admin/login', (req, res) => {
  req.checkBody('username', 'The name filed is required').notEmpty();
  req.checkBody('password', 'The password is invalid').isLength(6, 16);

  var username = req.body.username,
    password = req.body.password;
  User.findOne({
    username: username.toLowerCase()
  }).then(function (user) {
    if (!user) {
      res.render('admin/login', {
        success: false,
        message: 'Error, This user is not exist please try again'
      });
    } else if (!user.authenticate(password)) {
      res.render('admin/login', {
        success: false,
        message: 'Error,This password is not correct please try again'
      });
    } else {
      var admin = {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image
      }

      req.session.user = admin;

      res.redirect('/admin/dashboard');
    }
  }).catch((err) => {
    res.render('admin/login', {
      success: false,
      message: err.message
    });
  });
});


// route for user's dashboard
router.get('/admin/dashboard', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {

    async.parallel({

        user: function (cb) {
          adminModule.adminQueries.getAdmin({
              userId: req.session.user._id
            })
            .then((user) => {
              cb(null, user);
            })
            .catch((err) => {
              cb(null);
            });
        },
        setting: function (cb) {
          adminModule.adminQueries.getSetting({
              name: "app_name"
            })
            .then((setting) => {
              cb(null, setting);
            })
            .catch((err) => {
              cb(null);
            });
        },
        usersCounter: function (cb) {

          adminModule.adminQueries.usersCounter()
            .then((usersCounter) => {
              cb(null, usersCounter);
            })
            .catch((err) => {
              cb(null, 0);
            })
        },
        chatsCounter: function (cb) {

          adminModule.adminQueries.chatsCounter()
            .then((chatsCounter) => {

              cb(null, chatsCounter);
            })
            .catch((err) => {
              cb(null, 0);
            })
        },
        groupsCounter: function (cb) {

          adminModule.adminQueries.groupsCounter()
            .then((groupsCounter) => {
              cb(null, groupsCounter);
            })
            .catch((err) => {
              cb(null, 0);
            })
        },
        lastUsers: function (cb) {

          adminModule.adminQueries.lastUsers()
            .then((lastUsers) => {
              cb(null, lastUsers);
            })
            .catch((err) => {
              cb(null);
            })
        },
        usersByCountry: function (cb) {

          adminModule.adminQueries.getUsersByCountry()
            .then((users) => {
              cb(null, users);
            })
            .catch((err) => {
              cb(null);
            })
        }

      },
      function everything(err, results) {

        if (err)
          throw err;

        res.render('admin/dashboard', {
          user: results.user,
          setting: results.setting,
          usersCounter: results.usersCounter,
          groupsCounter: results.groupsCounter,
          chatsCounter: results.chatsCounter,
          lastUsers: results.lastUsers,
          usersByCountry: results.usersByCountry
        });
      });
  } else {

    res.redirect('/admin/login');

  }
});


router.get('/admin/dashboard/users/:page', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {

    async.parallel({
        user: function (cb) {
          adminModule.adminQueries.getAdmin({
              userId: req.session.user._id
            })
            .then((user) => {
              cb(null, user);
            })
            .catch((err) => {
              cb(null);
            });
        },
        setting: function (cb) {
          adminModule.adminQueries.getSetting({
              name: "app_name"
            })
            .then((setting) => {
              cb(null, setting);
            })
            .catch((err) => {
              cb(null);
            });
        },
        users: function (cb) {
          adminModule.adminQueries.getUsers({
              page: req.params.page
            })
            .then((users) => {
              cb(null, users);
            })
            .catch((err) => {
              cb(null);
            });
        }

      },
      function everything(err, results) {
        if (err)
          throw err;
        res.render('admin/users', {
          user: results.user,
          setting: results.setting,
          users: results.users
        });
      });
  } else {

    res.redirect('/admin/login');

  }
});


router.get('/admin/dashboard/users/delete/:userId', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    adminModule.adminQueries.removeUser({
        userId: req.params.userId
      })
      .then((deleted) => {
        res.redirect('/admin/dashboard/users/1');
      })
      .catch((err) => {
        res.redirect('/admin/dashboard/users/1');
      });
  } else {

    res.redirect('/admin/login');

  }
});

router.get('/admin/dashboard/chats/:page', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {

    async.parallel({
        user: function (cb) {
          adminModule.adminQueries.getAdmin({
              userId: req.session.user._id
            })
            .then((user) => {
              cb(null, user);
            })
            .catch((err) => {
              cb(null);
            });
        },
        setting: function (cb) {
          adminModule.adminQueries.getSetting({
              name: "app_name"
            })
            .then((setting) => {
              cb(null, setting);
            })
            .catch((err) => {
              cb(null);
            });
        },
        chats: function (cb) {
          adminModule.adminQueries.getChats({
              page: req.params.page
            })
            .then((chats) => {
              cb(null, chats);
            })
            .catch((err) => {
              cb(null);
            });
        }

      },
      function everything(err, results) {
        if (err)
          throw err;

        res.render('admin/chats', {
          user: results.user,
          setting: results.setting,
          chats: results.chats
        });
      });
  } else {

    res.redirect('/admin/login');

  }
});

router.get('/admin/dashboard/groups/:page', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {

    async.parallel({
        user: function (cb) {
          adminModule.adminQueries.getAdmin({
              userId: req.session.user._id
            })
            .then((user) => {
              cb(null, user);
            })
            .catch((err) => {
              cb(null);
            });
        },
        setting: function (cb) {
          adminModule.adminQueries.getSetting({
              name: "app_name"
            })
            .then((setting) => {
              cb(null, setting);
            })
            .catch((err) => {
              cb(null);
            });
        },
        groups: function (cb) {
          adminModule.adminQueries.getGroups({
              page: req.params.page
            })
            .then((groups) => {
              cb(null, groups);
            })
            .catch((err) => {
              cb(null);
            });
        }

      },
      function everything(err, results) {
        if (err)
          throw err;

        res.render('admin/groups', {
          user: results.user,
          setting: results.setting,
          groups: results.groups
        });
      });
  } else {

    res.redirect('/admin/login');

  }
});
router.get('/admin/dashboard/settings', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {

    async.parallel({
        user: function (cb) {
          adminModule.adminQueries.getAdmin({
              userId: req.session.user._id
            })
            .then((user) => {
              cb(null, user);
            })
            .catch((err) => {
              cb(null);
            });
        },
        setting: function (cb) {
          adminModule.adminQueries.getSetting({
              name: "app_name"
            })
            .then((setting) => {
              cb(null, setting);
            })
            .catch((err) => {
              cb(null);
            });
        },
        settings: function (cb) {
          adminModule.adminQueries.getSettings()
            .then((settings) => {
              cb(null, settings);
            })
            .catch((err) => {
              cb(null);
            });
        }

      },
      function everything(err, results) {
        if (err)
          throw err;
        res.render('admin/settings', {
          user: results.user,
          setting: results.setting,
          settings: results.settings
        });
      });
  } else {

    res.redirect('/admin/login');

  }
});

router.post('/admin/dashboard/save_settings', (req, res) => {
  //  req.checkBody('password', 'The password is invalid').isLength(6, 16);

  if (req.session.user && req.cookies.user_sid) {
    adminModule.adminQueries.saveSettings(req.body)
      .then((setting) => {
        res.redirect('/admin/dashboard/settings');
      })
      .catch((err) => {
        res.redirect('/admin/dashboard/settings');
      });

  } else {
    res.redirect('/admin/login');
  }
});
router.get('/admin/dashboard/edit_profile', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {

    async.parallel({
        user: function (cb) {
          adminModule.adminQueries.getAdmin({
              userId: req.session.user._id
            })
            .then((user) => {
              cb(null, user);
            })
            .catch((err) => {
              cb(null);
            });
        },
        setting: function (cb) {
          adminModule.adminQueries.getSetting({
              name: "app_name"
            })
            .then((setting) => {
              cb(null, setting);
            })
            .catch((err) => {
              cb(null);
            });
        }
      },
      function everything(err, results) {
        if (err)
          throw err;

        res.render('admin/edit_profile', {
          user: results.user,
          setting: results.setting,
          success: false,
          message: null
        });
      });
  } else {

    res.redirect('/admin/login');

  }
});

router.post('/admin/dashboard/save_profile', (req, res) => {


  //req.flash('error', 'Passwords do not match!');
  if (err) {

    async.parallel({
          user: function (cb) {
            adminModule.adminQueries.getAdmin({
                userId: req.session.user._id
              })
              .then((user) => {
                cb(null, user);
              })
              .catch((err) => {
                cb(null);
              });
          },
          setting: function (cb) {
            adminModule.adminQueries.getSetting({
                name: "app_name"
              })
              .then((setting) => {
                cb(null, setting);
              })
              .catch((err) => {
                cb(null);
              });
          }
        
      },
      function everything(err, results) {
        if (err)
          throw err;

        res.render('admin/edit_profile', {
          user: results.user,
          setting: results.setting,
          success: false,
          message: err
        });
      });
} else {
  if (req.session.user && req.cookies.user_sid) {
    filesController.uploadDashboard(req, res, function (err) {

      req.checkBody('admin_name', 'The name filed is required').notEmpty();
      req.checkBody('admin_email', 'The email field is invalid').isEmail();
      req.checkBody('old_admin_password', 'The old password is invalid').isLength(8, 16);
      req.checkBody('admin_password', 'The password is invalid').isLength(8, 16);
      let errors = req.validationErrors();
      if (errors) {
        return res.send({
          ok: false,
          message: errors[0].msg
        });
      } else {

        let data;
        if (req.files.length != 0) {

          data = {
            username: req.body.admin_name,
            email: req.body.admin_email,
            image: req.files[0].filename,
            old_admin_password: req.body.old_admin_password,
            password: req.body.admin_password,
            userId: req.session.user._id
          };
        } else {

          data = {
            username: req.body.admin_name,
            email: req.body.admin_email,
            image: null,
            old_admin_password: req.body.old_admin_password,
            password: req.body.admin_password,
            userId: req.session.user._id
          };
        }
        adminModule.adminQueries.editAdmin(data)
          .then((response) => { 
            async.parallel({

                setting: function (cb) {
                  adminModule.adminQueries.getSetting({
                      name: "app_name"
                    })
                    .then((setting) => {
                      cb(null, setting);
                    })
                    .catch((err) => {
                      cb(null);
                    });
                }
              },
              function everything(err, results) {
                if (err)
                  throw err;

                res.render('admin/edit_profile', {
                  user: response.user,
                  setting: results.setting,
                  success: response.success,
                  message: response.message

                });
              });
          })
          .catch((errResponse) => { 
            async.parallel({
                user: function (cb) {
                  adminModule.adminQueries.getAdmin({
                      userId: req.session.user._id
                    })
                    .then((user) => {
                      cb(null, user);
                    })
                    .catch((err) => {
                      cb(null);
                    });
                },
                setting: function (cb) {
                  adminModule.adminQueries.getSetting({
                      name: "app_name"
                    })
                    .then((setting) => {
                      cb(null, setting);
                    })
                    .catch((err) => {
                      cb(null);
                    });
                }
              },
              function everything(err, results) {
                if (err)
                  throw err;

                res.render('admin/edit_profile', {
                  user: results.user,
                  setting: results.setting,
                  success: errResponse.success,
                  message: errResponse.message
                });
              });
          });

      }
    });
  } else {

    res.redirect('/admin/login');

  }
}
});
// route for user logout
router.get('/admin/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/admin');
  } else {
    res.redirect('/admin/login');
  }
});




module.exports = router;