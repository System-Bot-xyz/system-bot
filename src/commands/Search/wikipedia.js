const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wikipedia = require('wikijs').default();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wikipedia')
        .setDescription('Ask wikipedia a question.')
        .addStringOption(option => option.setName('query').setDescription('Look something up in wikipedia.').setRequired(true)),
    async execute(interaction){
        const query = interaction.options.getString('query');
        await interaction.deferReply();
        const search = await wikipedia.search(query);
        if(!search.results.length) return await interaction.editReply({ content: `Wikipedia doesn't seem to know what you are talking about...` });
        const result = await wikipedia.page(search.results[0]);
        const summary = await result.summary();
        if(summary.length > 8192) return await interaction.reply({ content: `${summary.slice(0, 2048)}` });
        else {
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Wikipedia Seach: ${result.raw.title}`)
                .setDescription(`\`\`\`${summary.slice(0, 2048)}\`\`\``)

            await interaction.editReply({ embeds: [embed] });
        }
    }
};