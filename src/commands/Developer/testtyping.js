const { SlashCommandBuilder } = require('discord.js');
const { startTyping } = require('../../functions/startTyping');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starttyping')
        .setDescription('Start typing in a channel.'),
    async execute(interaction){
        startTyping(interaction.channel);
    }
};