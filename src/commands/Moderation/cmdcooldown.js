const { SlashCommandBuilder } = require('discord.js');

var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('command-cooldown')
        .setDescription('Command cooldown.'),
    async execute(interaction){
        if(timeout.includes(interaction.user.id)) return await interaction.reply({ content: `You are on a cooldown, try again in 1 minute` });
        await interaction.reply({ content: `Cooldown active!` });

        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 10000);
    }
};