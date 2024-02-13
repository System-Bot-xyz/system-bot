const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    owner: true,
    data: new SlashCommandBuilder()
        .setName('animated-avatar')
        .setDescription('Animate an avatar for the bot.')
        .addAttachmentOption(option => option.setName('avatar').setDescription('An avatar for the bot').setRequired(true)),
    async execute(interaction, client){
        const { options } = interaction;
        const avatar = options.getAttachment('avatar');

        async function sendMessage(message){
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(message);

            await interaction.reply({ embeds: [embed] });
        }

        if(avatar.contentType !== 'image/gif') return await sendMessage(`⚠ Please use a gif format for animated avatar.`);

        var error;
        await client.user.setAvatar(avatar.url).catch(async err => {
            error = true;
            console.log(err);
            return await sendMessage(`⚠ Error: \`${err.toString()}\``);
        });

        if(error) return;
        await sendMessage(`🌍 I have uploaded your avatar.`);
    }
};