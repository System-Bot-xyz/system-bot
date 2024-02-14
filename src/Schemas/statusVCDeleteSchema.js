const { model, Schema } = require('mongoose');

let statusVCDeleteSchema = new Schema({
    Guild: String,
    Channel: String
});

module.exports = model('statusVCDeleteSchema', statusVCDeleteSchema);