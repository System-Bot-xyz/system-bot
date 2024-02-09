const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Time out a server member.')
        .addUserOption(option => option.setName('user').setDescription('The user you want to time out').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('The duration of the timeout').addChoices(
            { name: '60 Seconds', value: '60' },
            { name: '2 Minutes', value: '120' },
            { name: '5 Minutes', value: '300' },
            { name: '10 Minutes', value: '600' },
            { name: '15 Minutes', value: '900' },
            { name: '20 Minutes', value: '1200' },
            { name: '30 Minutes', value: '1800' },
            { name: '45 Minutes', value: '2700' },
            { name: '1 Hours', value: '3600' },
            { name: '2 Hours', value: '7200' },
            { name: '3 Hours', value: '10800' },
            { name: '5 Hours', value: '18000' },
            { name: '10 Hours', value: '36000' },
            { name: '1 Day', value: '86400' },
            { name: '2 Days', value: '172800' },
            { name: '3 Days', value: '259200' },
            { name: '5 Days', value: '432000' },
            { name: '1 Week', value: '604800' },
            { name: '2 Weeks', value: '1209600' },
            { name: '4 Weeks', value: '2419200' },
            { name: '2 Months', value: '5256000' },
            { name: '3 Months', value: '7884000' },
            { name: '6 Months', value: '15768000' },
            { name: '1 Year', value: '31536000' },
            { name: '2 Years', value: '63072000' },
            
        ).setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for timing out the user.')),

    async execute(interaction){
        const timeUser = interaction.options.getUser('user');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
        const duration = interaction.options.getString('duration');

        if(!interaction.member.permissions.had(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `You must have the moderate members permissions to use this command.` });;
        if(!timeMember) return await interaction.reply({ content: `The user entioned is no longer within the servers` });
        if(!timeMember.kickable) return await interaction.reply({ content: `I cannot timeout this user! That is because either their role or themselves are above me!` });
        if(interaction.member.id === timeMember.id) return await interaction.reply({ content: `You cannot timeout yourself!` });
        if(timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You cannot timeout a person with the admin permission.` });

        let reason = interaction.options.getString('reason') || 'No reason provided';

        await timeMember.timeout(duration * 1000, reason);

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`:white_check_mark: ${timeMember.tag} has been **time out** for ${duration / 60} minutes(s) | ${reason}`);

        const dmEmbed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`:white_check_mark: You have been timed out in ${interaction.guild.name}. You can check the status of your timeout within the server | ${reason}` );

        await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        });

        await interaction.reply({ embeds: [embed] });
    }
};