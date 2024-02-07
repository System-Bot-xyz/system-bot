const mongoose = require('./mongoose');
const mysql = require('./mysql');
//const sql_server = require('./sql-server');
require('dotenv').config();

let connectionDB;
if (process.env.DATABASE_TYPE === 'mongodb') {
  connectionDB = mongoose;
} else if (process.env.DATABASE_TYPE === 'mysql') {
  connectionDB = mysql;
} else if (process.env.DATABASE_TYPE === 'sql-server') {
  connectionDB = sql_server;
} else {
  console.error('Invalid database type specified in .env file');
  process.exit(1);
}

module.exports = connectionDB;