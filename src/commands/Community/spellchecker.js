const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const spellcheck = require('simple-spellchecker');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spellcheck')
        .setDescription('Check if a word is spelled correctly.')
        .addStringOption(option => option.setName('query').setDescription('The word to check.').setRequired(true)),
    async execute(interaction){
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const query = options.getString('query');

        const embed = new EmbedBuilder()
            .setColor('Random')

        spellcheck.getDictionary('en-US', async function(err, dictionary){
            if(!err){
                const misspelled = ! dictionary.spellCheck(query);

                if(misspelled){
                    const suggestions = dictionary.getSuggestions(query);
                    embed.setDescription(`👉 \`${query}\` is **middpelled!** Here are some suggestion to fix it: \n\n>${suggestions.join(', ') || 'No suggestions found!'}`);
                } else {
                    embed.setDescription(`👉 \`${query}\` is **spelled correctly!**`);
                }
            }

            await interaction.editReply({ embeds: [embed] });
        });
    }
};