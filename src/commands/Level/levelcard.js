const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { Rank } = require('canvafy');
const level = require('../../Schemas/levelSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Displays level and XP')
        .addUserOption(option => option.setName('user').setDescription('The user to get level and XP').setRequired(false)),

    async execute(interaction) {
        try {
            let targetUser = interaction.options.getUser('user') || interaction.user;
            const existingLevel = await level.findOne({ userId: targetUser.id });
            if(!existingLevel) {
                return interaction.reply({ content: 'User does not have any level.', ephemeral: true });
            };
            const backgroundUrl = 'https://i.imgur.com/42FkG0c.png'
            const rank = await new Rank()
                .setAvatar(targetUser.displayAvatarURL({ format: 'png' }))
                .setUsername(targetUser.username)
                .setLevel(existingLevel.userLevel)
                .setCurrentXp(existingLevel.userXp)
                .setBackground('image', backgroundUrl)
                .setRequiredXp(100)
                .build();

            interaction.reply({ files: [rank], name: `rank-${interaction.member.id}.png` });
        } catch (error) {
            console.error('Error retrieving level and XP:', error);
            interaction.reply({ content: 'An error occured while retrieving level and XP!', ephemeral: true });
        }
    },
}