const { model, Schema } = require('mongoose');

let spamDetectSetupSchema = new Schema({
    Guild: String,
    Channel: String
});

module.exports = model('spamDetectSetupSchema', spamDetectSetupSchema);