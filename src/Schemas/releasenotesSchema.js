const { model, Schema } = require('mongoose');

let releasenotesSchema = new Schema({
    Updates: String,
    Date: String,
    Developer: String,
    Version: Number
});

module.exports = model('releasenotesSchema', releasenotesSchema);