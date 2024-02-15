const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random-quote')
        .setDescription('Get a random quote.'),
    async execute(interaction){
        await interaction.deferReply({ ephemeral: true });

        const input = {
            method: 'GET',
            url: `https://quotes15.p.rapidapi.com/quotes/random/`,
            headers: {
                'X-RapidAPI-Key': process.env.QUOTES_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
            }
        };

        try {
            const output = await axios.request(input);

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`${output.data.content} - ${output.data.originator.name}`)

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: 'There was an issue getting that quote!' });
        }
    }
};