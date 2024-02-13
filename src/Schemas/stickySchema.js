const { model, Schema } = require('discord.js');

let stickySchema = new Schema({
    Message: { type: String },
    ChannelID: { type: String },
    LastMessage: { type: String },
    LastMessageID: { type: String },
    MaxCount: { type: Number, default: 6 },
    CurrentCount: { type: Number, default: 0 },
});

module.exports = model('stickySchema', stickySchema);