const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildCreate',
    async execute(guild, client){
        const owner = await guild.fetchOwner();
        try {
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`System Bot`)
                .setDescription(`Thank you for adding me to your discord server! \nI'm here to help enhance your server experience!`)
                .setThumbnail(owner.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            const discordEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Additional Discord Server (IMPORTANT)')
                .setDescription(`Various Discord servers that are related to the Discord bot in some way.`)
                .addFields(
                    { name: 'System Bot', type: `https://discord.gg/mtQz7rPuxa`, inline: true },
                    { name: 'UplyTech UG', type: `https://discord.gg/RkZWWHW9hk`, inline: true },
                    { name: 'Vecto. Community', type: `https://discord.gg/DtHPAEHxZk`, inline: true },
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            const linksEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`UplyTech UG`)
                .setDescription(`If you need applications or graphic developments, then we are exactly the right contact for you! We have a wide variety of services from A to Z. Send us your order even if we don't have the service on our list.`)
                .addFields(
                    { name: 'Website', type: 'https://uplytech.de', inline: true },
                    { name: 'Services', type: 'https://uplytech.de/services', inline: true },
                    { name: 'Support', type: 'https://help.uplytech.de', inline: true },
                    { name: 'Profile', type: 'https://uplytech.de/proile', inline: true },

                    { name: 'Contact E-Mail', type: 'contact@uplytech.de', inline: true },
                    { name: 'Business E-Mail:', type: 'business@uplytech.de', inline: true },
                    { name: 'Founder E-Mail', type: 'founder@uplytech.de', inline: true },
                )
                .setThumbnail(client.user.displayAvatarURL(`https://i.imgur.com/tcFhSZr.png`, { dynamic: true }))

            owner.send({ embeds: [embed, discordEmbed, linksEmbed] });
        } catch(error) {
            return;
        }
    }
};