const { model, Schema } = require('mongoose');

let autopublishSchema = new Schema({
    Guild: String,
    Channel: String
});

module.exports = model('autopublishSchema', autopublishSchema);