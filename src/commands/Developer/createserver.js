const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-server')
        .setDescription('Create a server.'),
    async execute(interaction){
        await interaction.deferReply({ ephemeral: true });

        const data = {
            name: 'Bot Owned Server',
            icon: null,
            channel: [],
            system_channel_id: null,
            guild_template_code: process.env.GuildTemplateCode
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bot '
        };

        fetch(`https://discord.com/api/v9/guilds/templates/${process.env.GuildTemplateCode}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => response.json()).then((data) => {
            fetch(`https://discord.com/api/v9/channels/${data.system_channel_id}/invites`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    max_age: 86400
                })
            }).then((response) => response.json()).then((data) => {
                interaction.editReply({ content: `I have created your server: https://discord.gg/${data.code}` });
            })
        });
    }
};