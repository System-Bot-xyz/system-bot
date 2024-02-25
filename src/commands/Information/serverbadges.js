const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-badges')
        .setDescription('Get the total number of users with each profile badge.'),
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true });

        let badges = [];
        let counts = [];

        const staff = `<:DiscordStaff:1211342331895095386>`;
        const partner = `<:Partner:1211342343886610443>`;
        const moderator = `<:CertifiedModerator:1211342330217627718>`;
        const hypesquad = `<:Hypesquad:1211342335376629840>`;
        const bravery = `<:Bravery:1211342324404068352>`;
        const brilliance = `<:Brilliance:1211342326748676128>`;
        const balance = `<:Balance:1211342322617290803>`;
        const bughunter1 = `<:BugHunter1:1211342328397303818>`;
        const bughunter2 = `<:BugHunter2:1211342338954240030>`;
        const activedeveloper = `<:ActiveDeveloper:1211342352032202803>`;
        const verfieddeveloper = `<:VerifiedBotDeveloper:1211342405979213834>`;
        const earlysupporter = `<:EarlySupporter:1211342333627334728>`;
        const verifiedbot = `<:VerifiedBot:1211342348114600026>`;

        for(const member of interaction.guild.members.cache.values()){
            const user = await client.users.fech(member.user.id);
            badges = badges.concat(user.flags?.toArray());
        }

        for(const badge of badges){
            if(counts[badge]){
                counts[badge]++;
            } else {
                counts[badge] = 1;
            }
        }

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Badges - ${interaction.guild.name}`)
            .setDescription(`${staff} **${counts['Staff'] || 0}** \n ${partner} **${counts['Partner'] || 0}** \n ${moderator} **${counts['CertifiedModerator'] || 0}** \n ${hypesquad} **${counts['Hypesquad'] || 0}** \n ${bravery} **${counts['Bravery'] || 0}** \n ${brilliance} **${counts['Brilliance'] || 0}** \n ${balance} **${counts['Balance'] || 0}** \n ${bughunter1} **${counts['BugHunter1'] || 0}** \n ${bughunter2} **${counts['BugHunter2'] || 0}** \n ${activedeveloper} **${counts['ActiveDeveloper'] || 0}** \n ${verfieddeveloper} **${counts['VerfiedDeveloper'] || 0}** \n ${earlysupporter} **${counts['EarlySupporter'] || 0}** \n ${verifiedbot} **${counts['VerifiedBot'] || 0}**`)
            .setFooter({ text: `${interaction.guild.memberCount} Member` });

        await interaction.reply({ embeds: [embed] });
    },
};