const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('text-summarize')
        .setDescription('The text to summarize.')
        .addStringOption(option => option.setName('text').setDescription('The text to sumarize.').setRequired(true)),
    async execute(interaction){
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const text = options.getString('text');

        const input = {
            method: 'POST',
            url: 'https://gpt-summarization.p.rapidapi.com/summarize',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.TEXTSUMMARIZER_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'gpt-summarization.p.rapidapi.com'
            },
            data: {
                text: text,
                num_sentences: 3
            }
        };

        try {
            const output = await axios.request(input);

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(output.data.summary)

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: 'There was an issue getting that ai response! Try again later.' });
        }
    }
};