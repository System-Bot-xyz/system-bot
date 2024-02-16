const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const welcomeSetupSchema = require('../../Schemas/welcomeSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome-disable')
        .setDescription('Disable the welcome system for the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction){
        try {
            const guildId = interaction.guild.id;

            const deleteSetup = await welcomeSetupSchema.findOneAndDelete({ guildId });
            if(!deleteSetup){
                return await interaction.reply({ content: 'Welcome system is not enabled for this server.', ephemeral: true });
            }

            await interaction.reply({ content: `Welcome system has been disabled for this server.` })

        } catch (error) {
            console.error('error', error);
        }
    },
};