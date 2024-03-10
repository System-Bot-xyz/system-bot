const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, OAuth2Scopes } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-invite')
        .setDescription('Invite the bot to your server.')
        .addStringOption(option => option.setName('permissions').setDescription('The permissions you want to add to the bot. (presets)').addChoices(
            { name: `View Server (no mod perms)`, value: `517547088960` },
            { name: `Basic Moderation (Manage messages, roles and emojis)`, value: `545195949136` },
            { name: `Advanced Moderation (Manage Server)`, value: `545195949174` },
            { name: `Administrator`, value: `8` },
        ).setRequired(true)),
    async execute(interaction, client){
        const { options } = interaction;
        const perms = options.getString('permissions');

        const link = client.generateInvite({
            scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
            permissions: [
                perms,
            ],
        });

        const embed = new EmbedBuilder()
            .setColor('Random')

        if(!perms !== '8') embed.setDescription(`📎 I have generated an invite using the permissions you selected! To view the specific permissions, click on the invite and continue with a selected server. \n \n ⚠ This bot may require **admin perms** to fully function! By not selecting the highest perms for your server, you risk not being able to use all of this bots features \n\n> ${link}`);
        else embed.setDescription(`📎 I have generated an invite using the permissions you selected! To view the specific permissions, click on the invite and continue with a selected server. \n\n> ${link}`);

        await interaction.reply({ embeds: [embed] });
    }
};