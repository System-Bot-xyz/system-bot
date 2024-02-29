const { model, Schema } = require('mongoose');

let economySchema = new Schema({
    Guild: String,
    User: String,
    Bank: Number,
    Wallet: Number,
});

module.exports = model('economySchema', economySchema);