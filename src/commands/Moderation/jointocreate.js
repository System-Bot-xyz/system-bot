const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const jointocreateSchema = require('../../Schemas/jointocreateSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join-to-create')
        .setDescription('Setup and disable your join to create system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(command => command.setName('setup').setDescription('Sets up your join to create system.').addChannelOption(option => option.setName('channel').setDescription('The channel you want to be your join to create vc.').setRequired(true).addChannelTypes(ChannelType.GuildVoice)).addChannelOption(option => option.setName('category').setDescription('The category for the new Vcs to be created in.').setRequired(true).addChannelTypes(ChannelType.GuildCategory)).addIntegeryOption(option => option.setName('voice-limit').setDescription('Set the default limit for the new voice channels.').setMinValue(2).setMaxValue(10).setRequired(false)))
        .addSubcommand(command => command.setName('disable').setDescription('Disable your join to create system.')),
    async execute(interaction){
        const data = await jointocreateSchema.findOne({ Guild: interaction.guild.id });
        const sub = interaction.options.getSubcommand();

        switch(sub){
            case 'setup':
                if(data) return await interaction.reply({ content: 'You already have a join to create system set up!'})
                else {
                    const channel = interaction.options.getChannel('channel');
                    const category = interaction.options.getChannel('category');
                    const voiceLimit = interaction.options.getInteger('voice-limit') || 4;

                    await jointocreateSchema.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                        Category: category.id,
                        VoiceLimit: limit
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`The join to create system has been setup in ${channel} all new VCs will be created in ${category}.`);
                    
                    await interaction.reply({ embeds: [embed] });
                }
                break;

            case 'disable':
                if(!data) return await interaction.reply({ content: 'You do not have the join to create system setup yet.'});
                else {
                    const embed2 = new EmbedBuilder()
                        .setDescription(`The join to create system is now disabled.`)

                    await jointocreateSchema.deleteMany({ Guild: interaction.guild.id });

                    await interaction.reply({ embeds: [embed2] });
                }
        }
    }
};