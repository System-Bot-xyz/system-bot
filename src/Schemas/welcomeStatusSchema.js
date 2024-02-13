const { model, Schema } = require('mongoose');

let welcomeStatusSchema = new Schema({
    Guild: String,
    Enabled: Boolean,
    DM: Boolean
});

module.exports = model('welcomeStatusSchema', welcomeStatusSchema);