const { model, Schema } = require('mongoose');

let msgleaderboardSchema = new Schema({
    Guild: String,
    User: String,
    Messages: Number
});

module.exports = model('msgleaderboardSchema', msgleaderboardSchema);