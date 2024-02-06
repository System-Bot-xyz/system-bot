const { model, Schema } = require('mongoose');

const ticketSchema = new Schema({
    GuildID: String,
    Category: String,
    Channel: String,
    color: String,
    msg: String,
    supportonlinetime: String,
    applyduration: String,
    Role: String,
    Logs: String
});

module.exports = model('tickets', ticketSchema);