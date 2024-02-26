const { model, Schema } = require('mongoose');

let ghostpingSchema = new Schema({
    Guild: String,
});

module.exports = model('ghostpingSchema', ghostpingSchema);