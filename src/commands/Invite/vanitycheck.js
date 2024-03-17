const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vanity-check')
        .setDescription('Check to see if a vanity url is already taken.')
        .addStringOption(option => option.setName('vanity').setDescription('The vanity to check.').setRequired(true)),
    async execute(interaction, client){
        const { options } = interaction;
        const vanity = options.getString('vanity');

        async function sendMessage(message, send){
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(message);

            if(send){
                await interaction.reply({ content: `discord.gg/${vanity}`, embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        }

        var invite = await client.fetchInvite(vanity, { withCounts: true }).catch(err => {});
        var nInviteMsg = `The vanity invite \`${vanity}\` is **NOT** taken by a server!`;

        if(!invite){
            await sendMessage(nInviteMsg);
        } else {
            if(!invite.guild || !invite.guild.vanityURLCode || invite.guild.vanityURLCode !== vanity) return await sendMessage(nInviteMsg);

            await sendMessage(`Looks like the vanity \`${vanity}\` is taken by: discord.gg/${vanity} \n\n**${invite.guild.name}'s Server Features**: \n> Member Count: \`${invite.memberCount}\` \n> Server ID: \`${invite.guild.id}\` \n> Server Description: \`${invite.guild.description ?? 'None'}\` \n\n This server holds the invite \`${vanity}\` meaning it is not useable by anyone else. `)
        }
    }
};