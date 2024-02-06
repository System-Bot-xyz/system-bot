const { model, Schema } = require("mongoose");

const YoutubeNotificationSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    ytChannelId: {
        type: String,
        required: true,
    },
    message: {
        type: Date,
        required: true,
    },
    lastChecked: {
        type: Date,
        required: true,
    },
    vidChecked: {
        type: {
            id: {
                type: String,
                required: true,
            },
            datePub: {
                type: Date,
                required: true,
            },
        },
        required: false,
    }
});

module.exports = model("YoutubeNotificationSchema", YoutubeNotificationSchema);