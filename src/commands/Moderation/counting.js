const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const counting = require('../../Schemas/countingSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('counting')
        .setDescription('Setup the counting system for the server.')
        .addSubcommand(command => command.setName('setup').setDescription('Setup the counting system for the server.').addChannelOption(option => option.setName('channel').setDescription('The channel for the counting system.').addChannelTypes(ChannelType.GuildText).setRequired(true)))
        .addSubcommand(command => command.setName('disable').setDescription('Disable the counting system for the server.')),
    async execute(interaction){
        const { options } = interaction;
        const sub = options.getSubcommand();
        const data = await counting.findOne({ Guild: interaction.guild.id });

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You dont have the permissions to use this command!` });

        switch (sub) {
            case 'setup':
                if(data){
                    return await interaction.reply({ content: `⚠ Looks like this system is already setup!`, ephemeral: true });
                } else {
                    const channel = interaction.options.getChannel('channel');
                    await counting.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                        Number: 1
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`The counting system has been setup! Go to ${channel} and start at number 1!`);

                    await interaction.reply({ embeds: [embed] });
                }
                break;
        
            case 'disable':
                if(!data){
                    return await interaction.reply({ content: `��� Looks like this system is already disabled!`, ephemeral: true });
                } else {
                    await counting.deleteOne({
                        Guild: interaction.guild.id,
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`The counting system has been disabled for this server!`);

                    await interaction.reply({ embeds: [embed] });
                }
                break;
        }
    }
};
