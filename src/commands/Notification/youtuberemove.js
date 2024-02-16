const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const YoutubeNotificationSchema = require('../../Schemas/youtubeNotificationSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube-remove')
        .setDescription('Remove your youtube notifications channel system!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('channel-id').setDescription('ID of your youtube channel').setRequired(true)),

    async execute(interaction){
        try {
            await interaction.deferReply({ ephemeral: true });
            const ytChannelId = interaction.options.getString('channel-id');
            const notificationSystem = await YoutubeNotificationSchema.findOneAndDelete({ ytChannelId: ytChannelId });

            if(!notificationSystem) {
                interaction.followUp('That youtube channel is not set up.');
                return;
            }
            interaction.followUp('Successfully disabled notification system.');
        } catch (error) {
            console.error('Error', error);
        }
    }
        
}