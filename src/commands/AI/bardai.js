const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bard-ai')
        .setDescription('Ask bard AI a question.')
        .addStringOption(option => option.setName('question').setDescription('The question to ask the bard ai').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const question = options.getString('question');

        const input = {
            method: 'GET',
            url: 'https://google.bard1.p.rapidapi.com/',
            headers: {
                text: question,
                lang: 'en',
                psid: '',
                'X-RapidAPI-Key': process.env.BARDAI_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'google-bard1.p.rapidapi.com'
            },
            data: {
                question: question
            }
        };

        try {
            const output = await axios.request(input);

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(output.data.response);

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            return await interaction.editReply({ content: 'There was an issue getting that ai response! Try again later.' });
        }
    }
}