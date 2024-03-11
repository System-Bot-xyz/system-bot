const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const logSchema = require('../../Schemas/logSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('server-logs')
        .setDescription('Configure your logging system.')
        .addSubcommand(command => command.setName('setup').setDescription('Sets up your logging system.').addChannelOption(option => option.setName('channel').setDescription('Sepcified channel will receive logs.').setRequired(false).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)))
        .addSubcommand(command => command.setName('disable').setDescription('Disables your logging system.')),
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You do not have the permissions to use this command!` });

        const sub = await interaction.options.getSubcommand();
        const data = await logSchema.findOne({ Guild: interaction.guild.id });

        switch (sub) {
            case 'setup':
                if(data) return await interaction.reply({ content: `You have already setup the logging system! \n**/server-logs disable** to disable the logging system.` });
                else {
                    const logchannel = interaction.options.getChannel('channel') || interaction.channel;

                    const setupembed = new EmbedBuilder()
                        .setColor('Random')
                        .setAuthor({ name: `Logging System` })
                        .setTitle('> Logging System')
                        .addFields({ name: `Logging was Enabled`, value: `Your logging system has been set up successfully.` })
                        .addFields({ name: 'Channel', value: `${logchannel}` })
                        .setFooter({ text: `Logging Enabled` })
                        .setTimestamp();

                    await interaction.reply({ embeds: [setupembed] });

                    await logSchema.create({
                        Guild: interaction.guild.id,
                        Channel: logchannel.id
                    });
                }
                break;
        
            case 'disable':
                if(!data) return await interaction.reply({ content: `You do not have logging system setup yet.` });
                else {
                    const disableembed = new EmbedBuilder()
                        .setTitle('Logging disabled')
                        .setDescription('Logging was successfully disabled in this guild.')
                        .setTimestamp();

                    await interaction.reply({ embeds: [disableembed] });

                    await logSchema.deleteMany({ Guild: interaction.guild.id });
                }
                break;
        }
    }
};