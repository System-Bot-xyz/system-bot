const { EmbedBuilder, Events } = require('discord.js');

function handleLogs(client){
    const logSchema = require('../Schemas/logSchema');

    function send_log(guildId, embed){
        logSchema.findOne({ Guild: guildId }, async(err, data) => {
            if(!data || !data.Channel) return;
            const logChannel = client.channels.cache.get(data.Channel);

            if(!logChannel) return;
            embed.setTimestamp();

            try{
                logChannel.send({ embeds: [embed] });
            } catch(err){
                console.log(err);
            }
        });
    }

    client.on('messageUpdate', function(message){
        try {
            if(message.guild === null) return;
            if(message.author.bot) return;

            const embed = new EmbedBuilder()
                .setTitle('Message Deleted')
                .addFields({ name: 'Author', value: `<@${message.author.id}> - *${message.author.tag}*` })
                .addFields({ name: 'Channel', value: `${message.channel}` })
                .addFields({ name: 'Updated Message', value: `${message.content}` })
                .setTimestamp();

            return send_log(message.guild.id, embed);
        } catch (err) {
            console.log(err);
        }
    });

    client.on('messageDelete', function(message){
        try {
            if(message.guild === null) return;
            if(message.author.bot) return;

            const embed = new EmbedBuilder()
                .setTitle('Message Deleted')
                .addFields({ name: 'Author', value: `<@${message.author.id}> - *${message.author.tag}*` })
                .addFields({ name: 'Channel', value: `${message.channel}` })
                .addFields({ name: 'Deleted Message', value: `${message.content}` })
                .setTimestamp();

            return send_log(message.guild.id, embed);
        } catch (err) {
            console.log(err);
        }
    });

    client.on('guildBanAdd', (member, guild) => {
        try {
            if(channel.guild === null) return;
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Ban Add')
                .addFields({ name: 'Member', value: `${member.user}` })
                .addFields({ name: 'Reason', value: `${ban.reason}` })
                .setTimestamp();

            return send_log(channel.guild.id, embed);
        } catch (err) {
            console.log(err);
        }
    });

    client.on('guildChannelUpdate', (channel, oldChannel, newChannel) => {
        try {
            if(channel.guild === null) return;
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Channel Updated')
                .addFields({ name: 'Channel', value: `${channel}` })
                .addFields({ name: 'Changes', value: `` })
                .setTimestamp();

            return send_log(channel.guild.id, embed);
        } catch (err) {
            console.log(err);
        }
    });

    client.on('guildChannelPermissionsUpdate', (channel, oldPermissions, newPermissions) => {
        try {
            if(channel.guild === null) return;
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Channel Permissions Updated')
                .addFields({ name: 'Channel', value: `${channel}` })
                .addFields({ name: 'Changes', value: `Channel's Permissions/name were updated.` })
                .setTimestamp();

            return send_log(channel.guild.id, embed);
        } catch (err) {
            console.log(err);
        }
    });

    client.on('guildMemberBoost', (member) => {
        try {
            if(member.guild === null) return;
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${member.user.username} started boosting`)
                .addFields({ name: 'Member', value: `${member.user}` })
                .setTimestamp();

            return send_log(member.guild.id, embed);
        } catch (err) {
            console.log(err);
        }
    });

    client.on('guildMemberUnboost', (member) => {
        try {
            if(member.guild === null) return;
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${member.user.username} stopped boosting`)
                .addFields({ name: 'Member', value: `${member.user}` })
                .setTimestamp();

            return send_log(member.guild.id, embed);
        } catch (err) {
            console.log(err);
        }
    });

    client.on('guildMemberRoleAdd', (member, role) => {
        try {
            if(member.guild === null) return;
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${member.user.username} was given a role`)
                .addFields({ name: 'Member', value: `${member.user}` })
                .addFields({ name: 'Role', value: `${role}` })
                .setTimestamp();

            return send_log(member.guild.id, embed)
        } catch (err) {
            console.log(err);
        }
    });

    client.on('guildMemberRoleRemove', (member, role) => {
        try {
            if(member.guild === null) return;
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${member.user.username} lost a role`)
                .addFields({ name: 'Member', value: `${member.user}` })
                .addFields({ name: 'Role', value: `${role}` })
                .setTimestamp();

            return send_log(member.guild.id, embed)
        } catch (err) {
            console.log(err);
        }
    });

    client.on('guildMemberNicknameUpdate', (member, oldNickname, newNickname) => {
        try {
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Nickname Changed')
                .addFields({ name: 'Old Nickname', value: `${oldNickname || '**None**'}` })
                .addFields({ name: 'New Nickname', value: `${newNickname || '**None**'}` })
                .setTimestamp();

            return send_log(member.guild.id, embed);
        } catch (err) {
            console.log(err);
        }
    });
}

module.exports = { handleLogs };