const { model, Schema } = require("mongoose");

let levelSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    useEmbed: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: String,
    },
    userXp: {
        type: Number,
        default: 0,
    },
    userLevel: {
        type: Number,
        default: 1,
    },
    messages: [
        {
            content: {
                type: String,
                required: true,
            },
        },
    ],
});

module.exports = model('levelSchema', levelSchema);