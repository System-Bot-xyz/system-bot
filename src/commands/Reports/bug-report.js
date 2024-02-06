const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bug-report')
        .setDescription('Send a bug report to the bot devs.'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setTitle(`Bug Command Report`)
            .setCustomId('Bug Report')

        const command = new TextInputBuilder()
            .setCustomId('command')
            .setRequired(true)
            .setPlaceholder(`Bitte trage nur den Command Namen ein.`)
            .setLabel('Welcher Command hat einen Fehler ausgegeben?')
            .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setCustomId('description')
            .setRequired(true)
            .setPlaceholder('Beschreibe den Bug so gut wie möglich.')
            .setLabel('Beschreibe den Fehler von dem Command.')
            .setStyle(TextInputStyle.Paragraph);

        const one = new ActionRowBuilder().addComponents(command);
        const two = new ActionRowBuilder().addComponents(description);

        modal.addComponents(one, two);
        await interaction.showModal(modal);
    }
}