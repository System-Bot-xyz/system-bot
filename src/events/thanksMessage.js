const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildCreate',
    async execute(guild, client){
        const owner = await guild.fetchOwner();
        try {
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`System Bot`)
                .setDescription(`Thank you for adding me to your discord server! \nI'm here to help enhance your server expreience!`)
                .setThumbnail(owner.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            const discordEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Discord Server')
                .setDescription(`System Bot: \nhttps://discord.gg/mtQz7rPuxa \n\nVecto. Community: \nhttps://discord.gg/DtHPAEHxZk`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            owner.send({ embeds: [embed, discordEmbed] });
        } catch(error) {
            return;
        }
    }
};