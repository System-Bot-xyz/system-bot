const { model, Schema } = require('mongoose);

let warnSchema = new Schema({
    Guild: String,
    UserId: String,
    Reasons: String
});

module.exports = model('warnSchema', warnSchema);