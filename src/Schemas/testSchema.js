const { model, Schema } = require('mongoose');

let testSchema = new Schema({
    Guild: String,
    UserId: String,
    Message: String
});

module.exports = model('testSchema', testSchema);