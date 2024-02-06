const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const reviewSchema = require('../../Schemas/reviewSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('review-disable')
        .setDescription('Disable the review system.'),
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
            return await interaction.reply({ content: `>ou must have **Administrator** permissions to run this command.`, ephemeral: true });
        };

        const { guildId } = interaction;

        const embed = new EmbedBuilder();

        try {
            const deleteResult = await reviewSchema.deleteMany({ Guild: guildId });
            if(deleteResult.deleteCount > 0){
                embed.setColor('Random')
                .setDescription('The review system has been disabled.')
            } else {
                embed.setColor('Random')
                .setDescription('The review system was already disabled.')
            }

            return interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);

            embed.setColor('Random')
            .setDescription('Failed to disable review system.');
            
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};