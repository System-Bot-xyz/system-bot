const { model, Schema } = require('mongoose');

let inboxSchema = new Schema({
    User: String,
    Message: String,
    Guild: String,
    ID: String,
    Channel: String
});

module.exports = model('inboxSchema', inboxSchema);