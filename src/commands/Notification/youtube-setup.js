const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require("discord.js");
const YoutubeNotificationSchema = require('../../Schemas/youtubeNotificationSchema');
const Parser = require("rss-parser");
const parser = new Parser();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube-setup')
        .setDescription('Setup youtube notifications system!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('channel-id').setDescription('ID of your youtube channel').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('The channel you want to sent notifications.').addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText).setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Variables: {VIDEO_URL}, {VIDEO_TITLE}, {CHANNEL_URL}, {CHANNEL_NAME}')),

    async execute(interaction){
        try{
            await interaction.deferReply({ ephemeral: true });

            const ytChannelId = interaction.options.getString('channel-id');
            const channelId = interaction.options.getChannel('channel');
            const customMessage = interaction.options.getString('message');

            const existingSetup = await YoutubeNotificationSchema.exists({ channelId: channelId, ytChannelId, ytChannelId });

            if(existingSetup){
                interaction.followUp('That youtube channel is already set up.');
                return;
            }
            const rss_youtube = `https://www.youtube.com/feeds/videos.xml?channel_id${ytChannelId}`;
            const feed = await parser.parseURL(rss_youtube).catch((e) => {
                interaction.followUp('There was an error while parsing the rss feed.');
                return;
            });
            if(!feed) return;

            const channelName = feed.title;
            const saveInfo = new YoutubeNotificationSchema({
                guildId: interaction.guild.id,
                channelId: channelId.id,
                ytChannelId: ytChannelId,
                message: customMessage,
                lastChecked: new Date,
                vidChecked: null,
            });
            if(feed.items.length){
                const latestVideo = feed.items[0];

                saveInfo.vidChecked = {
                    id: latestVideo.id.split(':')[2],
                    datePub: latestVideo.pubDate,
                }
            }

            saveInfo.save().then(() => {
                const embed = new EmbedBuilder()
                    .setTitle('YouTube Notification Setup')
                    .setDescription(`All new video notifications is sent to ${channelId} by **${channelName}**.`)
                    .setTimestamp()

                interaction.followUp({ embeds: [embed] });
            }).catch((e) => {
                interaction.followUp('Error', error);
            });
        } catch(error){
            console.error('Error', error);
        }
    }
}