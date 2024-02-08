const { model, Schema } = require('mongoose');

let captchaSchema = new Schema({
    Guild: String,
    Role: String,
    Captcha: String,
});

module.exports = model('captchaSchema', captchaSchema)