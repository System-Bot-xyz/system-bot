const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const Level = require('../../Schemas/levelSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level-setup')
        .setDescription('Set up level settings.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel where level messages will be send.').setRequired(true))
        .addBooleanOption(option => option.setName('embed').setDescription('Whether to send level-up messages as embeds.').setRequired(false)),

    async execute(interaction, message){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You need **Administrator** permissions to setup level system.' });

        try {
            const channel = interaction.options.getChannel('channel');
            const guildId = interaction.guild.id;
            const userId = interaction.user.id;
            const channelId = channel.id;
            const useEmbed = interaction.options.getBoolean('embed') || false;

            const existingLevel = await Level.findOne({ guildId });
            if(existingLevel) {
                return await interaction.reply({
                    content: 'Level system is already set up.',
                    ephemeral: true,
                });
            }
            const userLevel = existingLevel;
            const defaultMessage = `Congratulations <@${userId}>! You leveled up to level ${userLevel}!`;
        
            await Level.create({
                guildId,
                channelId,
                messages: [{ content: defaultMessage }],
                useEmbed: true,
            });
            await interaction.reply('Level system set up successfully.');
        } catch (error) {
            console.error('error', error);
            await interaction.reply({
                content: 'An error occured while setting up the level system.',
                ephemeral: true,
            });
        }
    }
};