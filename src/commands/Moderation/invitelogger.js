const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const inviteSchema = require('../../Schemas/inviteSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('invite-logger')
        .setDescription('Set up the invite logger system.')
        .addSubcommand(command => command.setName('setup').setDescription('Set up the invite logger system.').addChannelOption(option => option.setName('channel').setDescription('The channel you want to send the invite logging in.').addChannelTypes(ChannelType.GuildText).setRequired(true)))
        .addSubcommand(command => command.setName('disable').setDescription('Set up the invite logger system.').setRequired(true)),
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You dont have permissions to manage the invite logging system.` });

        const { options } = interaction;
        const sub = options.getSubcommand();

        const Data = await inviteSchema.findOne({ Guild: interaction.guild.id });

        switch (sub) {
            case 'setup':
                const channel = options.getChannel('channel');
                if(Data) return await interaction.reply({ content: `The invite logging system is already enabled here!` });
                else {
                    await inviteSchema.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`:white_check_mark: The invite logging system has been enabled in ${channel}.`)

                    await interaction.reply({ embeds: [embed] });
                }
                break;
        
            case 'disable':
                if(!Data) return await interaction.reply({ content: `There is no invite logging system set up here!` });
                else {
                    await inviteSchema.deleteMany({ Guild: interaction.guild.id });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`:white_check_mark: The invite logging system has been disabled!`)

                    await interaction.reply({ embeds: [embed] });
                }
                break;
        }
    }
};