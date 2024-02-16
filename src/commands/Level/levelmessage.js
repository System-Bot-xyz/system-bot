const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Level = require('../../Schemas/levelSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level-message")
        .setDescription("Set a custom level up message. Available variables: {userMention}, {userName}, {userLevel}.")
        .addStringOption(option => option.setName('message').setDescription('The custom level up message. Available variables: {userMention}, {userName}, {userLevel}').setRequired(true)),

    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You must need **Administrator** Permissions to use this command.' });

        try {
            const guildId = interaction.guild.id;
            const existingLevel = await Level.findOne({ guildId });
            if(!existingLevel){
                return await interaction.reply({ content: 'Level system is not setup. Please setup the level system first.', ephemeral: true });
            }
            const userMessage = interaction.options.getString('message');
            const vaiables = {
                '{userMention}': `<@${interaction.user.id}>`,
                '{userName}': interaction.user.username,
            };
            const updateMessage = userMessage.replace(/{(.*?)}/g, (match, variable) => variable[variable] || match);

            existingLevel.messages[0].content = updateMessage;
            await existingLevel.save();

            await interaction.reply({ content: 'Custom level up message set successfully' });
        } catch (error) {
            console.error('error', error);
        }
    },
};