const { model, Schema } = require('mongoose');

let noteSchema = new Schema({
    Guild: String,
    User: String,
    Note: String,
    Moderator: String
});

module.exports = model('noteSchema', noteSchema);