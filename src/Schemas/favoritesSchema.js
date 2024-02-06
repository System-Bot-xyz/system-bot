const { model, Schema } = require("mongoose");

let favoritesSchema = new Schema({
    Guild: String,
    User: String,
    Channel: String,
    Note: String,
});

module.exports = model('favoritesSchema', favoritesSchema);