const mongoose = require('./mongoose');
const mysql = require('./mysql');
require('dotenv').config();

let connectionDB;
if (process.env.DATABASE === 'mongodb') {
  connectionDB = mongoose;
} else if (process.env.DATABASE === 'mysql') {
  connectionDB = mysql;
} else {
  console.error('Invalid database type specified in .env file');
  process.exit(1);
}

module.exports = connectionDB;