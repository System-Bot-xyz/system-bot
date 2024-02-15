const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ytmp3')
        .setDescription('Download the mp3 of a youtube video.')
        .addStringOption(option => option.setName('video-id').setDescription('The ID of your video.').setRequired(true)),
    async execute(interaction){
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const videoId = options.getString('video-id');

        const input = {
            method: 'GET',
            url: `https://youtube-mp3-download1.p.rapidapi.com/d1`,
            params: { id: videoId },
            headers: {
                'X-RapidAPI-Key': process.env.YOUTUBEMP3_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'youtube-mp3-download1.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(input);

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('📬 Download MP3')
                .setStyle(ButtonStyle.Link)
                .setURL(response.data.link)
            );

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`👉 Click below to get your MP3 version of \`${response.data.title}\`.`)

            await interaction.editReply({ embeds: [embed], components: [button] });
        } catch (e) {
            await interaction.editReply({ content: `👉 That video ID does not exist! Go to the YouTube link and copy the ID after the = or the /.` });
        }
    }
};