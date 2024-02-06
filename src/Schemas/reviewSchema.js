const { model, Schema } = require('mongoose');

let reviewSchema = new Schema({
    Guild: String,
    Channel: String,
});

module.exports = model('reviewSchema', reviewSchema);