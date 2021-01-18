/*
 * @Author: Abderrahim El imame 
 * @Date: 2019-05-18 22:57:21 
 * @Last Modified by:   Abderrahim El imame 
 * @Last Modified time: 2019-05-18 22:57:21 
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


if (process.env.NODE_ENV === 'production') {
  //require('@risingstack/trace');
}

const express = require('express');
const app = express();
require('./config/express')(app);

module.exports = app;