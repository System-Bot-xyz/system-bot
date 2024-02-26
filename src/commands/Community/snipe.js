const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('This is the snipe command.'),
    async execute(interaction, client) {
        const msg = client.snipes.get(interaction.channel.id);
        if(!msg) return await interaction.reply({ content: `I cant find any deleted messages!` });
        const ID = msg.author.id;
        const member = interaction.guild.members.cache.get(ID);
        const URL = member.displayAvatarURL();

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`SNIPED MESSAGE! (${member.user.tag})`)
            .setDescription(`${msg.content}`)
            .setTimestamp()
            .setFooter({ text: `Member ID: ${ID}`, iconURL: `${URL}` });

        if(msg.image) embed.setImage(msg.image);
        await interaction.reply({ embeds: [embed] });
    },
};