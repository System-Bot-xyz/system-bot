const { model, Schema } = require('mongoose');

let jointocreateSchema = new Schema({
    Guild: String,
    Channel: String,
    Category: String,
    VoiceLimit: Number
});

module.exports = model('jointocreateSchema', jointocreateSchema);