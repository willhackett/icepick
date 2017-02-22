(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var env = process.env;

var config = {
  PORT: env.PORT || 5010,
  AUTH_JWT_SECRET: env.ICEPICK_AUTH_JWT_SECRET,
  FILE_JWT_SECRET: env.ICEPICK_FILE_JWT_SECRET,
  THUMB_DIM: env.ICEPICK_THUMB_DIM || 256,
  SQUARE_DIM: env.ICEPICK_SQUARE_DIM || 512,
  BACKGROUND_DIM_X: env.ICEPICK_BACKGROUND_DIM_X || 1500,
  BACKGROUND_DIM_Y: env.ICEPICK_BACKGROUND_DIM_Y || 500,
  S3_ACCESS_KEY_ID: env.ICEPICK_S3_ACCESS_KEY_ID,
  S3_ACCESS_KEY: env.ICEPICK_S3_ACCESS_KEY,
  S3_REGION: env.ICEPICK_S3_REGION,
  S3_BUCKET: env.ICEPICK_S3_BUCKET,
  MAX_FILE_SIZE_BYTES: env.ICEPICK_MAX_FILE_SIZE_BYTES || 5 * 1024 * 1024,
  TEMP_UPLOAD_FOLDER: env.ICEPICK_TEMP_UPLOAD_FOLDER || 'temp_uploads/'
};

exports.config = config;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.returnToken = undefined;

var _jsonwebtoken = __webpack_require__(16);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _environment = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returns a token payload to the user in secret file format
var returnToken = function returnToken(req, res, next) {

  var payload = {
    sub: req.user.sub,
    files: req.uploaded
  };

  var token = _jsonwebtoken2.default.sign(payload, _environment.config.FILE_JWT_SECRET, { expiresIn: '10m' });

  res.status(200).json({ token: token });
  return next();
};

exports.returnToken = returnToken;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadS3 = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _aws = __webpack_require__(12);

var _aws2 = _interopRequireDefault(_aws);

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

var _debug = __webpack_require__(14);

var _debug2 = _interopRequireDefault(_debug);

var _environment = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('icepick:s3');
var s3 = new _aws2.default.S3();

// default options
var defaultOptions = {
  ACL: 'public-read',
  ContentType: 'image/jpeg',
  Bucket: _environment.config.S3_BUCKET
};

/**
 * Upload a local file to s3
 */
var uploadFile = function uploadFile(options) {
  return new Promise(function (resolve, reject) {
    s3.upload(_extends({}, defaultOptions, options), function (err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
};

/**
 * Middleware filename generator and uploader for S3
 */
var uploadS3 = function uploadS3(req, res, next) {
  var processed = req.processed,
      user = req.user;


  req.uploaded = {};

  var uploads = [];
  Object.keys(processed).forEach(function (key) {
    var item = processed[key];
    var fileStream = _fs2.default.readFileSync(_environment.config.TEMP_UPLOAD_FOLDER + item.filename);
    var target = item.targetfilename || item.filename;
    debug('uploading file: ' + item.filename + ' to ' + target);
    uploads.push(uploadFile({
      Key: user.sub + '/' + target,
      Body: fileStream
    }).then(function (_ref) {
      var Bucket = _ref.Bucket,
          Key = _ref.Key,
          Location = _ref.Location;

      // set the uploaded details for payload creation
      req.uploaded[key] = {
        bucket: Bucket,
        filename: Key,
        location: Location
      };
      debug('file uploading to: ' + Location);
    }));
  });

  Promise.all(uploads).then(function () {
    return next();
  }).catch(function (err) {
    return next(err);
  });
};

exports.uploadS3 = uploadS3;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * as we expect any uploaded files to be processed, generic files
 * just have a dummy passthrough. This is in case we need to do processing
 * in the future
 */
var processFile = function processFile(req, res, next) {
  var file = req.file;

  req.processed = {
    file: {
      filename: file.filename,
      targetfilename: file.filename + "/" + file.originalname
    }
  };
  next();
};

exports.processFile = processFile;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processBackground = exports.processSquare = undefined;

var _gm = __webpack_require__(15);

var _gm2 = _interopRequireDefault(_gm);

var _environment = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// wrap gm callback in promise
var write = function write(path, gm) {
  return new Promise(function (resolve, reject) {
    gm.write(path, function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
};

// process a square image into a square and thumb processed image
var processSquare = function processSquare(req, res, next) {
  var file = req.file,
      squareFile = file.filename + '_square.jpg',
      thumbFile = file.filename + '_thumb.jpg';


  var square = write(_environment.config.TEMP_UPLOAD_FOLDER + squareFile, (0, _gm2.default)(file.path).setFormat('jpg').resizeExact(_environment.config.SQUARE_DIM, _environment.config.SQUARE_DIM));
  var thumb = write(_environment.config.TEMP_UPLOAD_FOLDER + thumbFile, (0, _gm2.default)(file.path).setFormat('jpg').resizeExact(_environment.config.THUMB_DIM, _environment.config.THUMB_DIM));

  Promise.all([square, thumb]).then(function () {
    req.processed = {
      square: {
        filename: squareFile
      },
      thumb: {
        filename: thumbFile
      }
    };
    next();
  }).catch(function (err) {
    return next(err);
  });
};

// process a background image
var processBackground = function processBackground(req, res, next) {
  var file = req.file,
      backgroundFile = file.filename + '_background.jpg';


  write(_environment.config.TEMP_UPLOAD_FOLDER + backgroundFile, (0, _gm2.default)(file.path).setFormat('jpg').resize(_environment.config.BACKGROUND_DIM_X, _environment.config.BACKGROUND_DIM_Y)).then(function () {
    req.processed = {
      background: {
        filename: backgroundFile
      }
    };
    next();
  }).catch(function (err) {
    return next(err);
  });
};

exports.processSquare = processSquare;
exports.processBackground = processBackground;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanupFiles = undefined;

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

var _environment = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var removeFile = function removeFile(path) {
  _fs2.default.unlink(path, function (err) {
    if (err) {
      console.log('Error deleting file:', path);
    }
  });
};

var cleanupFiles = function cleanupFiles(req, res, next) {

  removeFile(req.file.path);
  Object.keys(req.processed).forEach(function (key) {
    var path = _environment.config.TEMP_UPLOAD_FOLDER + req.processed[key].filename;
    if (path !== req.file.path) {
      removeFile(path);
    }
  });

  return next();
};

exports.cleanupFiles = cleanupFiles;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _awsSdk = __webpack_require__(13);

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _environment = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.update({
  accessKeyId: _environment.config.S3_ACCESS_KEY_ID,
  secretAccessKey: _environment.config.S3_ACCESS_KEY,
  region: _environment.config.S3_REGION || 'us-east-1'
});

exports.default = _awsSdk2.default;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("gm");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(9);

var _express2 = _interopRequireDefault(_express);

var _multer = __webpack_require__(11);

var _multer2 = _interopRequireDefault(_multer);

var _bodyParser = __webpack_require__(7);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressJwt = __webpack_require__(10);

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _cors = __webpack_require__(8);

var _cors2 = _interopRequireDefault(_cors);

var _environment = __webpack_require__(0);

var _image = __webpack_require__(5);

var _file = __webpack_require__(4);

var _s = __webpack_require__(3);

var _auth = __webpack_require__(2);

var _file_helpers = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// middlewares
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
// enforce credentials for all uploads so we have a referencing subject
app.use((0, _expressJwt2.default)({ secret: _environment.config.AUTH_JWT_SECRET }));

// multer file upload setup
var upload = (0, _multer2.default)({
  dest: _environment.config.TEMP_UPLOAD_FOLDER,
  limits: { fileSize: _environment.config.MAX_FILE_SIZE_BYTES }
});

// square and thumbnail combination
app.post('/upload/image/square', upload.single('square'), _image.processSquare, _s.uploadS3, _auth.returnToken, _file_helpers.cleanupFiles);
// larger background image
app.post('/upload/image/background', upload.single('background'), _image.processBackground, _s.uploadS3, _auth.returnToken, _file_helpers.cleanupFiles);
// generic file upload
app.post('/upload/file', upload.single('file'), _file.processFile, _s.uploadS3, _auth.returnToken, _file_helpers.cleanupFiles);

app.listen(_environment.config.PORT, function () {
  console.log('Icepick file server listening on port ' + _environment.config.PORT);
});

/***/ })
/******/ ])));