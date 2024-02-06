const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const welcomeSetupSchema = require('../../Schemas/welcomeSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome-setup')
        .setDescription('Setup the welcome system for the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => option.setName('channel').setDescription('Set the channel you want to sent welcome messages').setRequired(true)),

    async execute(interaction){
        try {
            const guildId = interaction.guild.id;
            const channelId = interaction.options.getChannel('channel');
            const existingSetup = await welcomeSetupSchema.findOne({ guildId });
            if(existingSetup){
                return await interaction.reply({ content: 'Welcome setup already exists for this server.', ephemeral: true });
            }

            await welcomeSetupSchema.create({ guildId, channelId});

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`Welcome setup completed. Welcome messages will be sent to <#${channelId}>.`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('error', error);
            await interaction.reply({ content: 'An error occured', ephemeral: true });
        }
    }
};