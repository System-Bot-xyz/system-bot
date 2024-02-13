const { Events } = require('discord.js');
const spamDetectMainSchema = require('../Schemas/spamDetectMainSchema');
const spamDetectSetupSchema = require('../Schemas/spamDetectSetupSchema');

var count = 0;

module.exports = {
    name: Events.MessageCreate,
    async execute(message){
        if(!message.guild) return;

        var data = await spamDetectMainSchema.findOne({ Guild: message.guild.id, User: message.author.id });
        var data2 = await spamDetectSetupSchema.findOne({ Guild: message.guild.id });
        if(!data2) return;
        count++;

        if(data){
            const query = { Guild: message.guild.id, User: message.author.id };
            const update = { Count: count, Time: Date.now() };
            await spamDetectMainSchema.updateOne(query, { $set: update });
        } else {
            await spamDetectMainSchema.create({ Guild: message.guild.id, User: message.author.id, Count: count, Time: Date.now() });
        }

        if(!data) return;

        var execute;
        if((Date.now() - data.Time)/1000 <= 5 && count >= 5){
            const member = await message.guild.members.fetch(message.author.id);
            const messages = await message.channel.messages.fetch();
            
            var memMessages = [];
            
            await messages.forEach(async m => {
                if(m.author.id == member.id && memMessages.length < 5) memMessages.push(m.id);
            });

            await memMessages.forEach(async value => {
                const fMessage = await message.channel.messages.fetch(value);
                await fMessage.delete().catch(err => {});
            });

            var error;
            await member.timeout(100000).catch(err => {
                error = true;
            });

            count = 0;
            await spamDetectMainSchema.deleteOne({ Guild: message.guild.id, User: message.author.id });

            if(error) return;
            else execute = true;
        }

        if(execute){
            await message.author.send(`⚠ You have been flagged for **spam** in **${message.guild.name}**! You now are timed out. `).catch(err => {});

            if(data2.Channel){
                var channel = await message.guild.channels.fetch(data2.Channel);
                await channel.send(`⚠ I have timed out ${message.author} for spamming in ${message.channel}! This means they have sent more than 5 messages within 5 seconds. Their timeout is 1 minute and 30 seconds, so take action if needed.`);
            }
        }

    }
};