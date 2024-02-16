const { ContextMenuCommandBuilder, ApplicationCommand, PermissionsBitField, ApplicationCommandType } = require('discord.js');
const clone = require('discord-cloner');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Clone Message')
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false),
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ content: `You dont have permissions to use this command!` });
        await interaction.deferReply({ ephemeral: true });

        const message = await interaction.channel.messages.fetch(interaction.targetId);
        const channel = interaction.channel;

        try {
            await clone({ message: message, channel: channel, spoof: true });
        } catch (err) {
            return await interaction.editReply({ content: `There was an **error** while cloning your message: \`${err}\`.` });
        }

        await interaction.editReply({ content: `**Successfully** cloned your message!` });
    }
};