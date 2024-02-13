const { model, Schema } = require('mongoose');

let spamDetectMainSchema = new Schema({
    Guild: String,
    User: String,
    Count: Number,
    Time: Number,
});

module.exports = model('spamDetectMainSchema', spamDetectMainSchema);