const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
     .setName('punish')
     .setDescription('Punish a user.')
     .addUserOption(option => option.setName('user').setDescription('The user to punish.').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        if(!user) return interaction.reply('Please mention a user to punish.');

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Punishment Options')
            .setDescription(`Please select a punishment option for ${user.username}.`)
            .addFields({ name: 'kick', value: 'To kick the user.' })
            .addFields({ name: 'ban', value: 'To ban the user.' })
            .addFields({ name: 'warn', value: 'To warn the user.' })
            .addFields({ name: 'timeout', value: 'To timeout the user.' })
            .setTimestamp()

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('kick')
            .setLabel('Kick')
            .setEmoji('🦶')
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId('ban')
            .setLabel('Ban')
            .setEmoji('‼')
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId('warn')
            .setLabel('Warn')
            .setEmoji('⚠')
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('timeout')
            .setLabel('Timeout')
            .setEmoji('⌛')
            .setStyle(ButtonStyle.Primary),
        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const filter = (i) => i.customId === 'kick' || i.customId === 'ban' || i.customId === 'warn' || i.customId === 'timeout';

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 15000
        });

        collector.on('collect', async i => {
            switch(i.customId){
                case 'kick':
                    await interaction.guild.members.kick(user.id).then(() => {
                        interaction.followUp(`${user.username} has been kicked.`);
                    }).catch(error => {
                        interaction.followUp(`Failed to kick ${user.username} : ${error}`);
                    });
                    break;

                case 'ban':
                    await interaction.guild.members.ban(user.id).then(() => {
                        interaction.followUp(`${user.username} has been banned.`);
                    }).catch(error => {
                        interaction.followUp(`Failed to ban ${user.username} : ${error}`);
                    });
                    break;

                case 'warn':
                    user.send(`You have been warned in ${interaction.guild.name} in channel ${interaction.guild.channel.name}`);
                    break;

                case 'timeout':
                    const userTimeout = await interaction.guild.members.cache.get(user.id)
                    userTimeout.timeout(600000, 'Punished').then(() => {
                        interaction.followUp(`${user.username} has been timed out for 10 minutes.`);
                    }).catch(error => {
                        interaction.followUp(`Failed to timeout ${user.username} : ${error}`);
                    });
                    break;
            }
            collector.stop();
        });
        collector.on('end', () => {
            interaction.editReply({ components: [] });
        });
    }
};