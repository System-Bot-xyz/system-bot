const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium-create')
        .setDescription('Create a premium server.')
        .addStringOption(option => option.setName('server-id').setDescription('The server ID to add.').setRequired(true)),
    async execute(interaction){
        const id1 = options.getString('server-id');
        const params = {
            'sku_id': process.env.DEV_ID,
            'owner_id': id1,
            'owner_type': 1,
        }
        const response = await axios.post(`https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/entitlements`, params, {
            headers: {
                'Authorization': `Bot ${process.env.TOKEN}`,
            }
        });
        if(response.ok){
            await interaction.reply({ content: `Added ${id1} to the premium list.` });
        }
    }
};