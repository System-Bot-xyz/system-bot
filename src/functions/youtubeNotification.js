const Parser = require("rss-parser");
const parser = new Parser();
const YoutubeNotificationSchema = require('../Schemas/youtubeNotificationSchema');

module.exports = (client) => {
    client.youtubeCheck = async() => {
        try {
            const notificationSystems = await YoutubeNotificationSchema.find();
            for(const notificationSystem of notificationSystems){
                const rss_youtube = `https://www.youtube.com/feeds/videos.xml?channel_id=${notificationSystem.ytChannelId}`;

                const feed = await parser.parseURL(rss_youtube).catch((e) => {
                    null;
                });

                if(!feed?.items.length) continue;

                const latestVideo = feed.items[0];
                const vidChecked = notificationSystem.vidChecked;

                if(!vidChecked || latestVideo.id.split(':')[2] !== vidChecked.id && new Date(latestVideo.pubDate) > new Date(vidChecked.datePub)){
                    const guild = client.guilds.cache.get(notificationSystem.guildId);
                    if(!guild){
                        await notificationSystem.findOneAndDelete({ _id: notificationSystem._id });
                        continue;
                    }
                    const channel = guild.channels.cache.get(notificationSystem.channelId);
                    if(!channel){
                        await notificationSystem.findOneAndDelete({ _id: notificationSystem._id });
                        continue;
                    }

                    notificationSystem.vidChecked = {
                        id: latestVideo.id.split(':')[2],
                        datePub: latestVideo.pubDate,
                    };
                    notificationSystem.save().then(() => {
                        const message = notificationSystem.message
                            ?.replace('{VIDEO_URL}', latestVideo.link)
                            ?.replace('{VIDEO_TITLE}', latestVideo.title)
                            ?.replace('{CHANNEL_URL}', feed.link)
                            ?.replace('{CHANNEL_TITLE}', feed.title) ||
                            
                            `Video uploaded by ${feed.title}\n${latestVideo.link}`;
                        
                        channel.send(message);
                    }).catch((e) => null);
                }
            }
        } catch (error) {
            console.error('Error', error);
        }
    }
}