const { Events } = require('discord.js');
const msgleaderboardSchema = require('../Schemas/msgleaderboardSchema');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client){
        if(message.author.bot) return;
        var data = await msgleaderboardSchema.findOne({ Guild: message.guild.id, User: message.author.id });
        if(!data){
            await msgleaderboardSchema.create({
                Guild: message.guild.id,
                User: message.author.id,
                Messages: 1
            });
        } else {
            var updatedMessage = data.Messages + 1;
            await msgleaderboardSchema.deleteOne({ Guild: message.guild.id, User: message.author.id });
            await msgleaderboardSchema.create({ Guild: message.guild.id, User: message.author.id, Messages: updatedMessage });
        }
    }
};