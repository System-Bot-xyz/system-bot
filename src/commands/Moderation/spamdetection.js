const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const spamDetectMainSchema = require('../../Schemas/spamDetectMainSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('spam-detect')
        .setDescription('Setup the spam detection.')
        .addSubcommand(command => command.setName('enable').setDescription('Enable the spam detection system.').addChannelOption(option => option.setName('channel').setDescription('The log channel for spam catches').addChannelTypes(ChannelType.GuildText)))
        .addSubcommand(command => command.setName('disable').setDescription('Disable the spam detection system.')),
    async execute(interaction){
        const { options } = interaction;
        const sub = options.getSubcommand();
        var data = await spamDetectMainSchema.findOne({ Guild: interaction.guild.id });

        async function sendMessage(message){
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(message);

            await interaction.reply({ embeds: [embed] });
        }

        switch (sub) {
            case 'enable':
                if(data){
                    const channel = options.getChannel('channel') || false;
                    if(!channel){
                        await spamDetectMainSchema.create({ Guild: interaction.guild.id });
                    } else {
                        await spamDetectMainSchema.create({ Guild: interaction.guild.id, Channel: channel.id });
                    }

                    await sendMessage(`🌍 The spam detect system is now enabled.`);
                }
                break;
            case 'disable':
                if(!data){
                    await sendMessage(`⚠ This system is not yet setup!`);
                } else {
                    await spamDetectMainSchema.deleteOne({ Guild: interaction.guild.id });
                    await sendMessage(`🌍 I have disabled the spam detect system.`);
                }
                break;
        }
    }
};