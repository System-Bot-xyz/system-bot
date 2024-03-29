const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacard = require('canvacard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('Displays a users spotify status.')
        .addUserOption(option => option.setName('user').setDescription('This is the user you want to display the status of.').setRequired(true)),
    async execute(interaction){
        let user = interaction.options.getMember('user');
        
        if(user.bot) return await interaction.reply({ content: 'You cannot get a bots spotify status.' });

        let status;

        if(user.presence.activities.length === 1) status = user.presence.activities[0];
        else if(user.presence.activities.length > 1) status = user.presence.activities[1];

        if(user.presence.activities.length === 0 || status.name !== 'Spotify' && status.type !== 'Listening'){
            return await interaction.reply({ content: `${user.user.username} is not listening spotify!` });
        }

        if(status !== null && status.name === 'Spotify' && status.assets !== null){
            let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`,
            name = status.details,
            artist = status.state;
            album = status.assets.largeText;

            const card = new canvacard.Spotify()
                .setAuthor(artist)
                .setAlbum(album)
                .setStartTimestamp(status.timestamp.start)
                .setEndTimestamp(status.timestamps.end)
                .setImage(image)
                .setTitle(name)

            const Card = await card.build();
            const attachments = new AttachmentBuilder(Card, { name: 'spofity.png' });

            const embed = new EmbedBuilder()
                .setTitle(`${user.user.username}'s Spotify Track`)
                .setImage(`attachment://spotify.png`)
                .setTimestamp()
                .setFooter({ text: 'Spotify Tracker' })

            await interaction.reply({ embeds: [embed], files: [attachments] });
        }
    }
};