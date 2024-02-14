const { model, Schema } = require('mongoose');

let statusVCSchema = new Schema({
    Guild: String,
    Category: String
});

module.exports = model('statusVCSchema', statusVCSchema);