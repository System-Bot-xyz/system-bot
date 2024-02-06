const mongoose = require('mongoose');

// Definiere ein Schema für die Bot-Einstellungen
let botSchema = new mongoose.Schema({
    prefix: String,
    status: String,
    activity: String,
});

module.exports = model('botSchema', botSchema);