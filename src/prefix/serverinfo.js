const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'Gets the server informations.',
    run: async(client, message, args) => {
        const guild = message.guild;
        const memberCount = guild.memberCount.toString();
        const botCount = guild.members.cache.filter(member => member.user.bot).size.toString();
        const onlineCount = guild.members.cache.filter(member => member.presence?.status !== 'offline').size.toString();
        const offlineCount = guild.members.cache.filter(member => member.presence?.status == 'invisible').size.toString();
        const channelCount = guild.channels.cache.size.toString();
        const roleCount = guild.roles.cache.size.toString();
        const emojiCount = guild.emojis.cache.size.toString();
        const createdDate = guild.createdAt.toDateString();
        const region = guild.region;
        const owner = guild.ownerId;
        const verifyLevel = guild.verificationLevel.toString();

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Server Information')
            .addFields({ name: 'Server Name', value: `${guild.name}`, inline: true })
            .addFields({ name: 'Server Owner', value: `<@${owner}>`, inline: true })
            .addFields({ name: 'Created Date', value: `${createdDate}`, inline: true })
            .addFields({ name: 'Member Count', value: `${memberCount}`, inline: true })
            .addFields({ name: 'Bot Count', value: `${botCount}`, inline: true })
            .addFields({ name: 'Online Count', value: `${onlineCount}`, inline: true })
            .addFields({ name: 'Offline Count', value: `${offlineCount}`, inline: true })
            .addFields({ name: 'Channel Count', value: `${channelCount}`, inline: true })
            .addFields({ name: 'Role Count', value: `${roleCount}`, inline: true })
            .addFields({ name: 'Emoji Count', value: `${emojiCount}`, inline: true })
            .addFields({ name: 'Region', value: `${region}`, inline: true })
            .setThumbnail(guild.iconURL())
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};