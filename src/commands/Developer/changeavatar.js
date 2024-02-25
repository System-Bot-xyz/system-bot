const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    owner: true,
    data: new SlashCommandBuilder()
        .setName('set-avatar')
        .setDescription('Set the avatar of the bot.')
        .addAttachmentOption(option => option.setName('avatar').setDescription('The avatar you want your bot to get.').setRequired(true)),
    async execute(interaction, client){
        const { options } = interaction;
        const image = options.getAttachement('avatar');
        const avatar = image.url;

        if(interaction.user.id !== process.env.DEV_ID) return await interaction.reply({ content: 'Only **developers** can use this command!' });

        await interaction.reply({ ephemeral: true });

        const changed = await client.user.setAvatar(avatar).catch(err => {
            interaction.editReply({ content: `I found an error: ${err}` });
        });

        if (changed) {
            const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`I have set the avatar to: \`${avatar}\`.`)
            
            await interaction.editReply({ embeds: [embed] });
        } else {
            return;
        }
    }
};