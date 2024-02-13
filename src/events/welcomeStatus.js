const { Events, ActivityType } = require('discord.js');
const welcomeStatusSchema = require('../Schemas/welcomeStatusSchema');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member, client){
        var data = await welcomeStatusSchema.findOne({ Guild: member.guild.id });
        if(!data) return;

        var guild = member.guild;
        var string = `👋 Welcome ${member.user.username} to ${guild.name}! You are their ${guild.members.cache.size}th member.`;
        var toDM = `🪨 Take a look at my status! You may not be there for long...`;

        setTimeout(async () => {
            if(!member) return;
            await client.user.setActivity({
                name: string,
                type: ActivityType.Watching
            });
        }, 5000);

        if(data.DM){
            var msg = await member.send(toDM).catch(err => {});
            await msg.react('⭐');
        }
    }
};