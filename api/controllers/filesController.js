/*
 * @Author: Abderrahim El imame
 * @Date: 2019-05-18 22:48:09
 * @Last Modified by: Abderrahim El imame
 * @Last Modified time: 2019-05-18 22:57:48
 */

'use strict';

const config = require('../../config/environment');
const multer = require('multer');
const mkdirp = require('mkdirp');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
/*
 * method to create the uploads-store directory with sub-directory
 */
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (req.params.sub_location != null) {
      mkdirp(path.join(config.rootFiles, req.params.location, req.params.sub_location), function(err) {
        if (err) {
          return cb(new Error('Error while creating user folder. ' + req.params.location + '/' + req.params.sub_location));
        } else {
          return cb(null, path.join(config.rootFiles, req.params.location, req.params.sub_location));
        }
      });
    } else {
      mkdirp(path.join(config.rootFiles, req.params.location), function(err) {
        if (err) {
          return cb(new Error('Error while creating user folder. ' + req.params.location));
        } else {
          return cb(null, path.join(config.rootFiles, req.params.location));
        }
      });
    }
  },
  filename: function(req, file, cb) {
    // accept image only //// TODO: verification of file type allowed and also  the file size "ndir limit f config file"
    /*if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }else {*/
    let newFileName = uuid.v1();
    return cb(null, newFileName + path.extname(file.originalname));
    //}
  }
});

exports.upload = multer({
  storage: storage
});
/*
 * method to create the uploads-store directory with sub-directory for admin dashboard
 */
let storageDashboard = multer.diskStorage({
  destination: function(req, file, cb) {
    if (req.session.user._id != null) {
      mkdirp(path.join(config.rootFiles, "user_avatars", req.session.user._id), function(err) {
        if (err) {
          return cb(new Error('Error while creating user folder. ' + "user_avatars" + '/' + req.session.user._id));
        } else {
          return cb(null, path.join(config.rootFiles, "user_avatars", req.session.user._id));
        }
      });
    }
  },
  filename: function(req, file, cb) {
    // accept image only //// TODO: verification of file type allowed and also  the file size "ndir limit f config file"
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    } else {
      let newFileName = uuid.v1();
      return cb(null, newFileName + path.extname(file.originalname));
    }
  }
});
exports.uploadDashboard = multer({
  storage: storageDashboard
}).array('uploadDashboard');

/**
 * @api {post} /api/v1/files/:location 1.Upload new file (root location)
 * @apiVersion 0.1.0
 * @apiPermission UserAuthenticated
 * @apiName UploadFile
 * @apiGroup Files
 * @apiParam {String="images_files","documents_files","audios_files","videos_files","gifs_files","group_avatars"} location Server side location.
 * @apiParam {Binary} file The binary file to upload.
 * @apiHeader {String} Authorization the token to get access to data.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccess {String} success the response state.
 * @apiSuccess {String} filename the UUID file name.
 * @apiSampleRequest http://localhost:9001/api/v1/files/images_files
 * @apiSuccessExample {json} Response-Example:
 * {
 *    "success": true,
 *    "message": "The file has been uploaded successfully",
 *    "filename": "7e5eaeb0-bda4-11e7-8d81-818a53af3609.jpg"
 *  }
 */

exports.create = (req, res, next) => {
  /*  if (req.files) {
      if (req.files.length != 0) {
        return res.send({
          success: true,
          message: "The file has been uploaded successfully",
          filename: req.files[0].filename,
          thumbname: req.files[1].filename
        });
      } else {
        return res.send({
          success: false,
          message: "The field file is required!",
          filename: null,
          thumbname: null
        });
      }
    } else {*/
  if (req.file && req.file.filename) {
    return res.send({
      success: true,
      message: "The file has been uploaded successfully",
      filename: req.file.filename
    });
  } else {
    return res.send({
      success: false,
      message: "The field file is required!",
      filename: null
    });
  }
  //  }
};

/**
 * @api {post} /api/v1/files/:location/:sub_location 2.Upload new file (sub location)
 * @apiVersion 0.1.0
 * @apiPermission UserAuthenticated
 * @apiName UploadSubFile
 * @apiGroup Files
 * @apiParam {String="user_avatars"} location Server side location.
 * @apiParam {String= "userId"} sub_location Server side location.
 * @apiParam {Binary} file The binary file to upload.
 * @apiHeader {String} Authorization the token to get access to data.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2MzM5MDk2ODEiLCJpYXQiOjE1MDg4ODA2MzIsImV4cCI6MTUwODg4MjA3Mn0.5aZ8VG4To3Y1DWqosulw1swMTg2SYTNltfGIOY61r_k"
 * @apiSuccess {String} success the response state.
 * @apiSuccess {String} filename the UUID file name.
 * @apiSampleRequest http://localhost:9001/api/v1/files/user_avatars/59efb0f8e5c51c09193eeaee
 * @apiSuccessExample {json} Response-Example:
 * {
 *    "success": true,
 *    "message": "The file has been uploaded successfully",
 *    "filename": "7e5eaeb0-bda4-11e7-8d81-818a53af3609.jpg"
 *  }
 */

exports.create_sub_location = (req, res, next) => {

  if (req.file && req.file.filename) {
    return res.send({
      success: true,
      message: "The file has been uploaded successfully",
      filename: req.file.filename
    });
  } else {
    return res.send({
      success: false,
      message: "The field file is required!",
      filename: null
    });
  }
};


/**
 * @api {get} /api/v1/files/:location/:filename 3.Get file (root location)
 * @apiVersion 0.1.0
 * @apiPermission Authenticated
 * @apiName GetFile
 * @apiGroup Files
 * @apiParam {String="images_files","documents_files","audios_files","videos_files","gifs_files","group_avatars"} location Server side location.
 * @apiParam {String} filename uuid name.
 * @apiHeader {String} Authorization the token to get access to data.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2NjY3MTcyMDAiLCJpYXQiOjE1MDg3MDM4ODEsImV4cCI6MTUwODcwNTMyMX0.I0UIgEbDcGe6l9B6Xg-9jeog8ZenZnQ1TNkL7qatHmI"
 * @apiSuccess {Binamry} file the binary file.
 * @apiSampleRequest http://localhost:9000/api/v1/files/images_files/7e5eaeb0-bda4-11e7-8d81-818a53af3609.jpg
 */

exports.get_file = (req, res, next) => {
  req.checkParams('filename', 'The filename is required').notEmpty();
  req.checkParams('location', 'The files location is required').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    let filename = req.params.filename;
    let location = req.params.location;

    let locationFiles = require('readdir').readSync(path.join(config.rootFiles, location));
    locationFiles.forEach((file, i) => {
      if (filename === file) {

        fs.exists(path.join(config.rootFiles, location, file), (exists) => {
          if (exists) {

            var stat = fs.statSync(path.join(config.rootFiles, location, file));
            res.writeHead(200, {
              'Content-Type': mime.lookup(path.join(config.rootFiles, location, file)),
              'Content-Length': stat.size
            });

            var readStream = fs.createReadStream(path.join(config.rootFiles, location, file));
            readStream.pipe(res);

          } else {
            res.writeHead(404, {
              "Content-Type": "text/plain"
            });
            res.write("404 Not Found\n");
            res.end();

          }

        });
      }
    });
  }
};

/**
 * @api {get} /api/v1/files/:location/:sub_location/:filename 4.Get file (sub location)
 * @apiVersion 0.1.0
 * @apiPermission Authenticated
 * @apiName GetSubFile
 * @apiGroup Files
 * @apiParam {String="user_avatars"} location Server side location.
 * @apiParam {String="userId"} sub_location Server side location.
 * @apiParam {String} filename uuid name.
 * @apiHeader {String} Authorization the token to get access to data.
 * @apiHeaderExample {String} Header-Example:
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMTI2NjY3MTcyMDAiLCJpYXQiOjE1MDg3MDM4ODEsImV4cCI6MTUwODcwNTMyMX0.I0UIgEbDcGe6l9B6Xg-9jeog8ZenZnQ1TNkL7qatHmI"
 * @apiSuccess {Binamry} file the binary file.
 * @apiSampleRequest http://localhost:9001/api/v1/files/user_avatars/59efb0f8e5c51c09193eeaee/7e5eaeb0-bda4-11e7-8d81-818a53af3609.jpg
 */

exports.get_file_sub_location = (req, res, next) => {
  req.checkParams('filename', 'The filename is required').notEmpty();
  req.checkParams('location', 'The files location is required').notEmpty();
  req.checkParams('sub_location', 'The files sub_location is required').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    return res.send({
      success: false,
      message: errors[0].msg
    });
  } else {
    let filename = req.params.filename;
    let location = req.params.location;
    let sub_location = req.params.sub_location;

    let locationFiles = require('readdir').readSync(path.join(config.rootFiles, location, sub_location));
    locationFiles.forEach((file, i) => {
      if (filename === file) {

        fs.exists(path.join(config.rootFiles, location, sub_location, file), (exists) => {
          if (exists) {
            var stat = fs.statSync(path.join(config.rootFiles, location, sub_location, file));
            res.writeHead(200, {
              'Content-Type': mime.lookup(path.join(config.rootFiles, location, sub_location, file)),
              'Content-Length': stat.size
            });

            var readStream = fs.createReadStream(path.join(config.rootFiles, location, sub_location, file));
            readStream.pipe(res);

          } else {
            res.writeHead(404, {
              "Content-Type": "text/plain"
            });
            res.write("404 Not Found\n");
            res.end();

          }

        });
      }
    });

  }
};