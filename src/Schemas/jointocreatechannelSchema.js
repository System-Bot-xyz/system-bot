const { model, Schema } = require('mongoose');

let jointocreatechannelSchema = new Schema({
    Guild: String,
    User: String,
    Channel: String
});

module.exports = model('jointocreatechannelSchema', jointocreatechannelSchema);