const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player-report')
        .setDescription('Erstelle einen Spieler Report.'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setTitle(`Spieler Report`)
            .setCustomId('Player Report')

        const playername = new TextInputBuilder()
            .setCustomId('playername')
            .setRequired(true)
            .setPlaceholder(`Gebe den Spielernamen korrekt an!`)
            .setLabel('Welchen Spieler möchtest du Reporten?')
            .setStyle(TextInputStyle.Short);

        const reportreason = new TextInputBuilder()
            .setCustomId('reportreason')
            .setRequired(true)
            .setPlaceholder('Gebe den Grund an, weshalb du diesen Spieler Reportest.')
            .setLabel('Nenne deinen Grund.')
            .setStyle(TextInputStyle.Paragraph);

        const one = new ActionRowBuilder().addComponents(playername);
        const two = new ActionRowBuilder().addComponents(reportreason);

        modal.addComponents(one, two);
        await interaction.showModal(modal);
    }
}