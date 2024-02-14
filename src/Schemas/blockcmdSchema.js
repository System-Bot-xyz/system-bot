const { model, Schema } = require('discord.js');

let blockcmdSchema = new Schema({
    Guild: String,
    Command: String
});

module.exports = model('blockcmdSchema', blockcmdSchema);