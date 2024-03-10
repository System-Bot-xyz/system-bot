const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');
const voiceschema = require('../../Schemas/jointocreateSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('join-to-create')
        .setDescription('Setup and disable your join to create voice channel.')
        .addSubcommand(command => command.setName('setup').setDescription('Sets up your join to create voice channel system.').addChannelOption(option => option.setName('channel').setDescription('The channel you want to be your join to create vc.').setRequired(true).addChannelTypes(ChannelType.GuildVoice)).addChannelOption(option => option.setName('category').setDescription('The category for the new VCs to be created in.').setRequired(true).addChannelTypes(ChannelType.GuildCategory)).addIntegerOption(option => option.setName('voice-limit').setDescription('Set the default limit for the new voice channels.').setMinValue(2).setMaxValue(10)))
        .addSubcommand(command => command.setName('disable').setDescription('Disables your join to create voice channel system.')),
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You dont have permissions to use this command!` });

        const data = await voiceschema.findOne({ Guild: interaction.guild.id });
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'setup':
                if(data) return await interaction.reply({ content: `You already have a setup for the join to create system! Do /join-to-create disable to remove it.` });
                else {
                    const channel = interaction.options.getChannel('channel');
                    const category = interaction.options.getChannel('category');
                    const limit = interaction.options.getInteger('voice-limit') || 3;

                    await voiceschema.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                        Category: category.id,
                        Limit: limit
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`The join to create system has been setup in **${channel}**, all new VCs will be created in **${category}**.`);

                    await interaction.reply({ embeds: [embed] });
                }
                break;
        
            case 'disable':
                if(!data) return await interaction.reply({ content: `There is no join to create system setup here!` });
                else {
                    const embed2 = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`The join to create system has been **disabled**.`);

                    await voiceschema.deleteMany({ Guild: interaction.guild.id });

                    await interaction.reply({ embeds: [embed2] });
                }
                break;
        }
    }

};