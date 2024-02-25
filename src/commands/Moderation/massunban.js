const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('mass-unban')
        .setDescription('Unbans EVERYONE from the server.'),
    async execute(interaction){
        const { options, guild } = interaction;
        const users = await interaction.guild.bans.fetch();
        const ids = users.map(u => u.user.id);

        if(!users) return await interaction.reply({ content: `There is no one banned in this server.` });

        await interaction.reply({ content: `Unbanning everyone in your server, this may take time if you have a lot of banned users...` });

        for(const id of ids){
            await guild.members.unban(id).catch(err => {
                return interaction.editReply({ content: `${err.rawError}` });
            });
        }

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`:white_check_mark: Successfully unbanned **${ids.length}** members from this server.`)

        await interaction.editReply({ content: '', embeds: [embed] });
    }
};