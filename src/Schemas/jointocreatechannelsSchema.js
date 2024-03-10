const { model, Schema } = require('mongoose');

let jointocreatechannelsSchema = new Schema({
    Guild: String,
    User: String,
    Channel: String
});

module.exports = model('jointocreatechannelsSchema', jointocreatechannelsSchema);