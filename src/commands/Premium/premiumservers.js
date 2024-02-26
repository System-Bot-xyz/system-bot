const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium-server')
        .setDescription('List the premium server.'),
    async execute(interaction){
        const response = await axios.get(`https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/entitlements`, params, {
            headers: {
                'Authorization': `Bot ${process.env.TOKEN}`,
            }
        });
        var servers = [];
        await response.data.forEach(async data => {
            let guildId = data.guild_id;
            servers.push(`${guildId}`);
        });

        if(servers.length == 0){
            return await interaction.reply({ content: `There are no servers.` });
        } else {
            await interaction.reply({ content: `Servers with Premium:\n${servers.join('\n')}` });
        }
    }
};