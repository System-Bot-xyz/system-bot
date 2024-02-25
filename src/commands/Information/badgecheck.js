const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badge-check')
        .setDescription('Check who has rare badges within your server.')
        .addStringOption(option => option.setName('badge').setDescription('The rare badge to index.').addChoices(
            { name: 'Staff', value: 'Staff' },
            { name: 'Partner', value: 'Partner' },
            { name: 'Certified Moderator', value: 'CertifiedModerator' },
            { name: 'Hypesquad', value: 'Hypesquad' },
            { name: 'Verified Bot', value: 'VerifiedBot' },
            { name: 'Early Supporter', value: 'EarlySupporter' },
            { name: 'Verified Bot Developer', value: 'VerifiedDeveloper' },
            { name: 'Active Developer', value: 'ActiveDeveloper' },
        ).setRequired(true)),
    async execute(interaction){
        const { options } = interaction;
        const badge = options.getString('badge');

        await interaction.deferReply({ ephemeral: true });

        let members = [];
        await interaction.guild.members.cache.forEach(async member => {
            if(member.user.flags.toArray().includes(check)) members.push(member);
        });

        if(members.length === 0) members.push('None');

        try {
            await interaction.deferReply({ content: `The people with the **${check}** badge within this server: \n\n> ${members.join('\n')}` });
        } catch (e) {
            return await interaction.editReply({ content: `There are **too many** people with the ${check} badge to send!` });
        }
    }
};