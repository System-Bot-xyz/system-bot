const { model, Schema } = require('mongoose');

let blacklistserverSchema = new Schema({
    Guild: String,
});

module.exports = model('blacklistserverSchema', blacklistserverSchema);