const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pagination = require('../../functions/pagination');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pagination')
        .setDescription('Testing pagination system.'),
    async execute(interaction){
        const embeds = [];

        var page1 = `First site`;
        var page2 = `Second site`;
        var page3 = `Third site`;

        for(var i = 0; i < 3; i++){
            if(i + 1 == 1) embeds.push(new EmbedBuilder().setColor('Random').setDescription(page1));
            else if(i + 1 == 2) embeds.push(new EmbedBuilder().setColor('Random').setDescription(page2));
            else if(i + 1 == 3) embeds.push(new EmbedBuilder().setColor('Random').setDescription(page3));
        }

        await pagination(interaction, embeds);
    }
};