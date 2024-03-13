const { GiveawaysManager: gw } = require('discord-giveaways');
const giveawaySchema = require('../Schemas/giveawaySchema');

module.exports = class GiveawaysManager extends gw {
    async getAllGiveaways(){
        return await giveawaySchema.findOne().lean().exec();
    }

    async saveGiveaway(messageId, giveawayData){
        return await giveawaySchema.create(giveawayData);
    }

    async editGiveaway(messageId, giveawayData){
        return await giveawaySchema.updateOne({ messageId }, giveawayData, {
            omitUndefined: true
        }).exec();
    }

    async deleteGiveaway(messageId){
        return await giveawaySchema.deleteOne({ messageId }).exec();
    }
};