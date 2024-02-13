const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const stickySchema = require('../../Schemas/stickySchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stick')
        .setDescription('Create a sticky message in the current channel.')
        .addStringOption(option => option.setName('message').setDescription('The message you want to stick to the chat').setRequired(true))
        .addStringOption(option => option.setName('count').setDescription('How frequently you want the sticky message to be sent').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction){
        let string = interaction.options.getString('message');
        let amount = interaction.options.getInteger('count') || 6;

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(string)
            .setFooter({ text: 'This is a sticky message.' });

        stickySchema.findOne({ ChannelID: interaction.channel.id }, async(err, data) => {
            if(err) throw err;

            if(!data){
                let msg = await interaction.channel.send({ embeds: [embed] });

                stickySchema.create({
                    ChannelID: interaction.channel.id,
                    Message: string,
                    MaxCount: amount,
                    LastMessageID: msg.id
                });

                return await interaction.reply({ content: 'The sticky message has been setup.' });
            } else {
                await interaction.reply({ content: 'You already have a sticky message setup within this channel, please do /unstick to remove it and then try again.' });
            }
        });
    }
};