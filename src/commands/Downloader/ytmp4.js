const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ytmp4')
        .setDescription('Download a youtube video.')
        .addStringOption(option => option.setName('video-id').setDescription('The youtube video ID to download.').setRequired(true)),
    async execute(interaction){
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const videoId = options.getString('video-id');
        const input = {
            method: 'GET',
            url: `https://youtube-video-download-info.p.rapidapi.com/d1`,
            params: { id: videoId },
            headers: {
                'X-RapidAPI-Key': process.env.YOUTUBE_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
            }
        };

        try {
            const output = await axios.request(input);
            const link = output.data.link[22];

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('📩 Download MP4')
                .setStyle(ButtonStyle.Link)
                .setURL(link[0])
            );

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`💳 Download the mp4 version of \`${output.data.title}\` below!`)

            await interaction.editReply({ embeds: [embed], components: [button] });
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: `⚠ That video ID is not valid! Go to the URL and copy the ID at the end of the link.` });
        }
    }
};