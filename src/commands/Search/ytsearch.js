const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube-search')
        .setDescription('Search for a video on a youtube channel.')
        .addStringOption(option => option.setName('channel-id').setDescription('The youtubers channel ID.').setRequired(true))
        .addStringOption(option => option.setName('query').setDescription('The keywords you want to search for.').setRequired(true)),
    async execute(interaction){
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const query = options.getString('query').toLowerCase();
        const channelID = options.getString('channel-id');

        let data = await Parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`);
        let { author } = data.items[0];

        let links = [];
        let titles = [];
        await data.items.forEach(async value => {
            const title = value.title.toLowerCase();

            if(title.includes(query)){
                links.push(value.link);
                titles.push(value.title);
            } else {
                return;
            }
        });

        if(links.length === 0 || titles.length === 0){
            return await interaction.editReply({ content: `There are no **recent** videos matching \`${query}\` on ${author}'s channel!` });
        }

        try {
            await interaction.editReply({ content: `**Videos Matching** \`${query}\` \n\n\`\`\`${titles.join(' \n \n \n')}\`\`\` \n \n \n> ${links.join(' , ')} \n \n*Please note, not all links will be embedded*` });
        } catch (e) {
            return await interaction.editReply({ content: `There are **SO MANY** videos matching ${query} that i cant send a message with them.` });
        }
    }
}