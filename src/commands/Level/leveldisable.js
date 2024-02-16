const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Level = require('../../Schemas/levelSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level-disable")
        .setDescription("Disable the level system for this server."),
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You must have **Administrator** Permissions to use this command.' });

        try {
            const guildId = interaction.guild.id;
            const existingLevel = await Level.findOne({ guildId });
            if(!existingLevel) {
                return await interaction.reply({ content: 'Level system is not setup. There is nothing to disable.', ephemeral: true });
            };
            await Level.findOneAndDelete({ guildId });
            await interaction.reply({ content: 'Level system has been disabled.', ephemeral: true });
        } catch (error) {
            console.error('error', error);
            await interaction.reply({ content: 'An error occured while disabling level system.', ephemeral: true });
        }
    },
};