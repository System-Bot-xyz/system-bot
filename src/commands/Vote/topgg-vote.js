const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote-topgg')
        .setDescription('Vote for our bot by Top.GG'),
    async execute(interaction) {
        const apiKey = process.env.TOPGG_API_KEY; //top.gg bot api key
        const botId = process.env.CLIENT_ID; //bot id
        const userId = interaction.user.id; //user id
        
        try {
            const response = await fetch(`https://top.gg/api/bots/${botId}/check?userId=${userId}`,
            {headers: {
                Authorization: apiKey,
            },
        });
        if(response.ok){
            const data = await response.json();
            if(data.voted === 1){
                return interaction.reply('You already voted.')
            } else if(data.voted === 0){
                const voteEmbed = new EmbedBuilder()
                    .setDescription(`Vote for our bot by Top.GG!`)

                return interaction.reply({ embeds: [voteEmbed] });
            }
        } else {
            return interaction.reply({ content: 'There was an error!' });
        }
        } catch (error) {
            return interaction.reply({ content: 'There was an error!' });
        }
    }
};