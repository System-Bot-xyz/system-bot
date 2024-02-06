const mongoose = require('mongoose');

// Definiere ein Schema für die Server-Einstellungen
let serverSchema = new mongoose.Schema({
    id: String,
    name: String,
    icon: String,
    prefix: String,
    welcomeChannel: String,
    welcomeTitleMessage: String,
    welcomeDescriptionMessage: String,
    welcomeThumbnail: String,
    welcomeFooterMessage: String,
    goodbyeChannel: String,
    goodbyeTitleMessage: String,
    goodbyeDescriptionMessage: String,
    goodbyeThumbnail: String,
    goodbyeFooterMessage: String,
});

module.exports = model('serverSchema', serverSchema);