const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    owner: true,
    data: new SlashCommandBuilder()
        .setName('sheet-db')
        .setDescription('Create a google sheet.')
        .addStringOption(option => option.setName('name').setDescription('The name').setRequired(true))
        .addStringOption(option => option.setName('age').setDescription('The age').setRequired(true))
        .addStringOption(option => option.setName('email').setDescription('The email').setRequired(true)),

    async execute(interaction){
        await interaction.reply({ content: `I've entered your entry.` });

        const name = interaction.options.getString('name');
        const age = interaction.options.getString('age');
        const email = interaction.options.getString('email');

        axios.post('https://sheetdb.io/api/v1/oenh97wo0yy19', {
            data: {
                name: {name},
                age: {age},
                email: {email}
            }
        });
    }
};