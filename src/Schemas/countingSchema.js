const { model, Schema } = require('mongoose');

let countingSchema = new Schema({
    Guild: String,
    Channel: String,
    Number: Number,
    LastUser: String,
});

module.exports = model('countingSchema', countingSchema);