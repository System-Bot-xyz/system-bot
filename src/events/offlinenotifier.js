const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.PresenceUpdate,
    async execute(oldStatus, newStatus, client){
        if(newStatus.user.id !== process.env.CLIENT_ID) return;
        var bot = await client.users.fetch(process.env.CLIENT_ID);

        async function sendMessage(message){
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(message);

            var channel = await client.channels.fetch(process.env.DEV_CHANNEL);
            var member = await client.users.fetch(process.env.DEV_ID);

            await channel.send({ embeds: [embed] }).catch(err => {});
            await member.send({ embeds: [embed] }).catch(err => {});
        }

        var timestamp = `<t:${Math.floor(Date.now() / 1000)}:R>`;
        if(!oldStatus && newStatus.status !== 'offline'){
            await sendMessage(`**${bot.username} is back Online!** \n${bot.username} (${bot.id}) was recently offline and as of now (${timestamp}) is back online!`);
        } else if(oldStatus.status !== 'offline' && newStatus.status == 'offline'){
            await sendMessage(`**Looks like ${bot.username} is Oflline!** \n${bot.username} (${bot.id}) became offline ${timestamp}, you might need to turn it back on to resolve this issue.`);
        }
    }
};