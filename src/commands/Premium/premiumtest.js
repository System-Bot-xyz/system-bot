const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('premium-test')
        .setDescription('Testing premium commands.'),
    async execute(interaction){
        await interaction.reply({ content: 'Premium test passed!' });
    }
};