const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-bg')
        .setDescription('Remove a background of a image!')
        .addAttachmentOption(option => option.setName('image').setDescription('The image you want to remove the bg of').setRequired(true)),
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const image = interaction.options.getAttachment('image');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            header: {
                'X-Api-Key': process.env.REMOVEBG_API_KEY,
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                image_url: image.proxyURL,
                size: 'auto'
            }),
        });

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const attachment = new AttachmentBuilder(buffer, { name: 'removebg.png' });

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Remove your images background')
            .setImage('attachment://removebg.png')

        await interaction.editReply({ embeds: [embed], files: [attachment], ephemeral: true });

    },
}