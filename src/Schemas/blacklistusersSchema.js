const { model, Schema } = require('mongoose');

let blacklistusersSchema = new Schema({
    User: String,
});

module.exports = model('blacklistusersSchema', blacklistusersSchema);