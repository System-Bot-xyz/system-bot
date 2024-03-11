const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const inboxSchema = require('../../Schemas/inboxSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inbox')
        .setDescription('Get your mention inbox.')
        .addSubcommand(command => command.setName('get').setDescription('Get your mention inbox.'))
        .addSubcommand(command => command.setName('clear').setDescription('Clear your mention inbox.').addStringOption(option => option.setName('id').setDescription('The ID of the message to clear (type ALL to clear everything).').setRequired(true))),
    async execute(interaction){
        const { options } = interaction;
        const sub = options.getSubcommand();
        var data = await inboxSchema.find({ User: interaction.user.id });

        async function sendMessage(message){
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(message);

            await interaction.reply({ embeds: [embed] });
        }

        switch (sub) {
            case 'get':
                if(data.length == 0){
                    await sendMessage(`⚠ You have no messages in your inbox.`);
                } else {
                    var string = `**Your Inbox**:`;
                    await data.forEach(async value => {
                        string += `\n\n> Message Content: ${value.Message} (https://discord.com/channels/${value.Guild}/${value.Channel}/${value.ID}) | ID: \`${value.ID}\``;
                    });

                    if(string.length >= 2000) return await sendMessage(`Your inbox is to full to send... run /inbox clear 'ALL' to clear it.`);

                    await sendMessage(string);
                }
                break;
        
            case 'clear':
                const id = options.getString('id');
                if(data.length == 0) return await sendMessage(`You have nothing in your inbox.`);

                if(id == 'ALL'){
                    await inboxSchema.deleteMany({ User: interaction.user.id });
                    await sendMessage(`Your inbox has been cleared.`);
                } else {
                    var checkData = await inboxSchema.findOne({ User: interaction.user.id, ID: id});
                    if(!checkData) return await sendMessage(`That ID does not exist in your inbox.`)

                    await inboxSchema.deleteOne({ User: interaction.user.id, ID: id});
                    await sendMessage(`I have deleted the message with the ID \`${id}\`.`)
                }
                break;
        }
    }
};