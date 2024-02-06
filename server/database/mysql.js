const mysql = require('mysql');
require('dotenv').config();

const connectionMYSQL = mysql.createConnection({
  host: process.env.MYSQL_HOSTNAME,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connectionMYSQL.connect((err) => {
  if (err) {
    console.error('Websocket: Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Websocket: Connected to MySQL database as id ' + connectionMYSQL.threadId);
});

module.exports = connectionMYSQL;