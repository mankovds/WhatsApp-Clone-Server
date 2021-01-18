/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:55:16 
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-12-20 14:43:21
 */

const config = require('./environment');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const validator  = require('express-validator');
const i18n = require('../i18n');
const cookieParser = require('cookie-parser');
const lusca = require('lusca');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const favicon = require('serve-favicon');
const logger = require('morgan');
const morgan = require('morgan');
const basicAuth = require('basic-auth');
const eventAction = require('../api/routes/app-modules/app-event-listener');

var auth = function(req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === 'bencherif' && user.pass === 'bencherif') {
    return next();
  } else {
    return unauthorized(res);
  }
};


module.exports = function(app) {
  // mongoose instance connection url connection
  mongoose.Promise = global.Promise;
  mongoose.connect(config.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.info('Connection to db has been successfully established');
 
    }
  });


  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useUnifiedTopology', true);


  // view engine setup
  app.set('views', path.join(config.root, '/views'));

// Set view engine as EJS
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
 // app.set('view engine', 'ejs');


  //  use Express's caching , if you like:
  app.set('view cache', false);
  // NOTE: You should always cache templates in a production environment.
  // Don't leave both of these to `false` in production!

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

  // Check list Security//

  app.use(lusca({
    csrf: false,
    xframe: 'DENY',
    p3p: 'ABCDEF',
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    xssProtection: true,
    nosniff: true
  }));
  app.disable('x-powered-by');
  app.use(logger('dev'));
  app.use(bodyParser.json({
    limit:"50mb"
  }));
  app.use(bodyParser.urlencoded({
    limit:"50mb",
    extended: false
  }));
  // initialize cookie-parser to allow us access the cookies stored in the browser.
  app.use(cookieParser());

  // initialize express-session to allow us track the logged-in user across sessions.
  var sess = {
    key: 'user_sid',
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    secret: 'DBbFZX3ZsUPRVniUA1Y1020NZzhRasrApsjGlPg2Nq8vB',
    cookie: {
      maxAge: (4 * 60 * 60 * 1000), // 4 hours
    },
    saveUninitialized: false,
    resave: false
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = false // serve secure cookies
    //    Change  cookie: { secure: true }to  cookie: { secure: false }
    //  using secure flag means that the cookie will be set on Https only.
  }
  app.use(session(sess));



  // This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
  // This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
  app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');
    }
    next();
  });

  // Check list Security//

  app.use(i18n);

 
 
app.use(validator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
  

  app.use(express.static(path.join(__dirname, '../public')));
  
  //Put your documentation  folder here
  app.use('/doc', auth, express.static(path.join(__dirname, '../doc')));

  //Put your angular dist folder here
  //
  //var admin = require('../routes');
  ///  app.use('/admin', express.static(path.join(__dirname, '../public/apps/admin-app/dist')));
  //  app.use('/admin', admin);
  //
  // Routing Systems
  require('../routes')(app);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404; 
    // respond with html page
    if (req.accepts('html')) {
     
      res.render('404');
      return;
    }else{
      next(err);
    }

  });

    // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use('/:url(api|auth)/*', function (err, req, res, next) {
      res.status(500);

      res.send({
        message: err.message,
        error: err.stack
      });

    });
    
    app.use(function (err, req, res, next) {
  
      res.status(500);
      res.render('500');
    });

  }

  // production error handler
  // no stacktraces leaked to user
  app.use('/:url(api|auth)/*', function (err, req, res, next) {
    res.status(500);
    res.send(err);
  });

  app.use(function (err, req, res, next) {
    res.status(500);
    res.render('500');
  });
};