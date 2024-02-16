const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear-links')
        .setDescription('Clear links from a channel. (up to 14 days old)')
        .addChannelOption(option => option.setName('channel').setDescription('The channel you want to clear the links.').addChannelTypes(ChannelType.GuildText)),
    async execute(interaction){
        const { guild, options } = interaction;
        const channel = options.getChannel('channel') || interaction.channel;
        const messages = await channel.messages.fetch();

        await interaction.deferReply({ ephemeral: true });

        let count = [];
        let response;
        await messages.forEach(async m => {
            if(m.content.includes('https://') || m.content.includes('discord.gg/') || m.content.includes('http://')){
                await m.delete().catch(err => {});
                count++;
                response = true;

                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`📁 I have deleted \`${count}\` messages containing **links** from this channel. *This could take minutes to complete. Keep in mind- if the count seems low, its due to me not being able to delete messages 14 days or older.*`)

                await interaction.editReply({ content: '', embeds: [embed] });
            } else {
                return;
            }
        });

        if(response == true){
            return;
        } else {
            await interaction.editReply({ content: `👱‍♂ You have \`0\` links in this channel! *There may be links 14 days or older still.*` });
        }
    }
};