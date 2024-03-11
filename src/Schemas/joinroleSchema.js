const { model, Schema } = require('mongoose');

let joinroleSchema = new Schema({
    Guild: String,
    RoleID: String,
    RoleName: String,
});

module.exports = model('joinroleSchema', joinroleSchema);