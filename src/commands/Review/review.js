const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const reviewSchema = require('../../Schemas/reviewSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('review')
        .setDescription('Give a review to the server.')
        .addStringOption(option => option.setName('message').setDescription('The feedback from you').setMaxLength(2000).setMinLength(1).setRequired(true))
        .addStringOption(option => option.setName('rating').setDescription('The amount of stars you would rate (1-5)').setRequired(true).addChoices(
            { name: '⭐', value: '⭐' },
            { name: '⭐⭐', value: '⭐⭐' },
            { name: '⭐⭐⭐', value: '⭐⭐⭐' },
            { name: '⭐⭐⭐⭐', value: '⭐⭐⭐⭐' },
            { name: '⭐⭐⭐⭐⭐', value: '⭐⭐⭐⭐⭐' },
        )),
    async execute(interaction, client) {
        const rating = interaction.options.getString('message');
        const stars = interaction.options.getString('rating');

        try {
            const data = await reviewSchema.findOne({ Guild: interaction.guild.id });
            if(!data){
                await interaction.reply({ content: `The system has not been set up in this server.`, ephemeral: true });
                return;
            }

            const interactionEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Review Posted`)
                .setDescription(`Thanks for leaving a review for this server!`)
                .setTimestamp();

            const reviewEmbed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`Review: ${rating}`)
                .addFields({ name: `Rating`, value: `${stars}` })
                .addFields({ name: `Author`, value: `${interaction.user.tag} (ID: ||${interaction.user.id}||)` });

            const channel = interaction.guild.channels.cache.get(data.Channel);
            if(!channel){
                await interaction.reply({ content: `The review channel could not be found.`, ephemeral: true });
                return;
            }

            await interaction.reply({ embeds: [interactionEmbed] });
            await channel.send({ embeds: [reviewEmbed] });
        } catch (err) {
            console.log(err);
            await interaction.reply({ content: `An error occured`, ephemeral: true });
        }
    }
};