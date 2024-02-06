const { model, Schema } = require('mongoose');

let welcomeSetupSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    welcomeMessage: {
        type: String,
        default: 'Welcome to the server!',
    },
    useEmbed: {
        type: Boolean,
        default: false,
    },
    channelId: {
        type: String,
        required: true,
    }
});

module.exports = model('welcomeSetupSchema', welcomeSetupSchema);