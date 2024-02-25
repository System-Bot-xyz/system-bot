const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badges')
        .setDescription('Get the badges of a user.')
        .addUserOption(option => option.setName('user').setDescription('The user you want to check the badges of.')),
    async execute(interaction){
        const { options } = interaction;
        await interaction.deferReply();

        let user = options.getUser('user') || interaction.user;
        let member = await interaction.guild.members.cache.get(user.id);
        let flags = user.flags.toArray();

        let badges = [];
        let extrabadges = [];

        await Promise.all(flags.map(async badge => {
            if(badge === 'Staff') badges.push('<:DiscordStaff:1211342331895095386>')
            if(badge === 'Partner') badges.push('<:Partner:1211342343886610443>')
            if(badge === 'CertifiedModerator') badges.push('<:CertifiedModerator:1211342330217627718>')
            if(badge === 'Hypesquad') badges.push('<:Hypesquad:1211342335376629840>')
            if(badge === 'Bravery') badges.push('<:Bravery:1211342324404068352>')
            if(badge === 'Brilliance') badges.push('<:Brilliance:1211342326748676128>')
            if(badge === 'Balance') badges.push('<:Balance:1211342322617290803>')
            if(badge === 'BugHunterLevel1') badges.push('<:BugHunter1:1211342328397303818>')
            if(badge === 'BugHunterLevel2') badges.push('<:BugHunter2:1211342338954240030>')
            if(badge === 'ActiveDeveloper') badges.push('<:ActiveDeveloper:1211342352032202803>')
            if(badge === 'VerifiedDeveloper') badges.push('<:VerifiedBotDeveloper:1211342405979213834>')
            if(badge === 'PremiumEarlySupporter') badges.push('<:EarlySupporter:1211342333627334728>')
            if(badge === 'VerifiedBot') badges.push('<:VerifiedBot:1211342348114600026>')
        }));

        const userData = await fetch(`https://japi.rest/discord/v1/user/${user.id}`);
        const { data } = await userData.json();

        if(data.public_flags_array){
            await Promise.all(data.public_flags_array.map(async badge => {
                if(badge === 'NITRO') badge.push(`<:Nitro:1211342341978329200>`);
            }));
        }

        if(user.bot){
            const botFetch = await fetch(`https://discord.com/api/v10/applications/${user.id}/rpc`);

            let json = await botFetch.json();
            let flagsBot = json.flags;

            const gateways = {
                APPLICATION_COMMAND_BADGE: 1 << 23,
            };

            const arrayFlags = [];

            for(let i in gateways){
                const bit = gateways[i];
                if((flagsBot & bit) === bit) arrayFlags.push(i);
            }

            if(arrayFlags.includes('APPLICATION_COMMAND_BADGE')){
                badges.push(`<:SlashCommands:1211342435553378434>`)
            }
        }

        if(!user.discriminator || user.discriminator === 0 || user.tag === `${user.username}#0`){
            badges.push(`<:Knownas:1211342340380299344>`);

            extrabadges.push(`https://cdn.discordapp.com/attachments/1080219392337522718/1109461965711089694/username.png`)
        }

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${user.username}'s Badges`)
            .setDescription(`${badges.join(' ') || `**No Badges found**`}`)

        await interaction.editReply({ embeds: [embed] });
    }
};