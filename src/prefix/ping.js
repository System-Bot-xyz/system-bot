const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'ping',
    description: 'Ping of the Bot.',

    run: async(interaction, client, message, args) => {
        const embed = new EmbedBuilder()
            //.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTitle('Bot Stats')
            .setDescription('My connections and stats.')
            .addFields(
                { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
                { name: 'Uptime', value: `${ms(client.uptime)}`, inline: true },
                { name: 'Guilds', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Users', value: `${client.users.cache.size}`, inline: true },
                { name: 'Channels', value: `${client.channels.cache.size}`, inline: true }
            )
            .setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};