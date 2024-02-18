const { model, Schema } = require('discord.js');

let jointocreateSchema = new Schema({
    Guild: String,
    Channel: String,
    Category: String,
    VoiceLimit: Number
});

module.exports = model('jointocreateSchema', jointocreateSchema);