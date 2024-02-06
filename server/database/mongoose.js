const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODBURL, {}).then(() => {
  console.log('Websocket: Connected to MongoDB.');
}).catch((err) => {
  console.error('Error connecting to MongoDB: ' + err.stack);
});

module.exports = mongoose;