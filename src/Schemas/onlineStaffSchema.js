const { model, Schema } = require('mongoose');

let onlineStaffSchema = new Schema({
    Guild: String,
    Channel: String,
    Role: String
});

module.exports = model('onlineStaffSchema', onlineStaffSchema);