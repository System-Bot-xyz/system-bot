const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'topgg-vote',
    description: 'Vote on Top.GG for the bot.',
    run: async(client, message) => {
        const apiKey = process.env.TOPGG_API_KEY;
        const botId = process.env.CLIENT_ID;
        const userId = message.author.id;

        try {
            const response = await fetch(`https://top.gg/api/bots/${botId}/check?userId=${userId}`, {
                headers: {
                    Authorization: apiKey,
                },
            });

            if(response.ok){
                return message.reply('You are able to use this command!')
            } else if(data.voted === 0) {
                const voteEmbed = new EmbedBuilder()
                    .setDescription(`Please vote for our bot to use this command.`)

                return message.reply({ embeds: [voteEmbed] });
            } else {
                return message.reply({ content: 'There was an error!' });
            }
        } catch (error) {
            console.error('Error:', error)
            return message.reply('There was an error on website.')
        }
    }
};