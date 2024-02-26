const { model, Schema } = require('mongoose');

let ghostnumSchema = new Schema({
    Guild: String,
    User: String,
    Number: Number
});

module.exports = model('ghostnumSchema', ghostnumSchema);