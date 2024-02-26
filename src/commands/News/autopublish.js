const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const autopublishSchema = require('../../Schemas/autopublishSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('auto')
        .setDescription('Setup and disable the auto publisher system.')
        .addSubcommand(command => command.setName('publisher-add').setDescription('Adds a channel to the auto publisher channel list.').addChannelOption(option => option.setName('channel').setDescription('The channel you want to auto publish.').addChannelTypes(ChannelType.GuildAnnouncement).setRequired(true)))
        .addSubcommand(command => command.setName('publisher-remove').setDescription('Remove a channel from the auto publisher list.').addChannelOption(option => option.setName('channel').setDescription('The channel you want to remove from the list.').addChannelTypes(ChannelType.GuildAnnouncement).setRequired(true))),
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You dont have perms to manage the auto publish system.` });

        const { options } = interaction;
        const sub = options.getSubcommand();
        const channel = options.getChannel('channel');

        switch (sub) {
            case 'publisher-add':
                const data = await autopublishSchema.findOne({ Guild: interaction.guild.id });

                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`All messages sent in ${channel} will be auto published!`)

                if(!data){
                    await interaction.reply({ embeds: [embed] });

                    await autopublishSchema.create({
                        Guild: interaction.guild.id,
                        Channel: [ ]
                    });

                    await autopublishSchema.updateOne({ Guild: interaction.guild.id}, { $push: { Channel: channel.id } });
                } else {
                    if(data.Channel.includes(channel.id)) return await interaction.reply({ content: `The channel you selected has already been setup for auto publishing.` });

                    await autopublishSchema.updateOne({ Guild: interaction.guild.id}, { $push: { Channel: channel.id } });
                    await interaction.reply({ embeds: [embed] });
                }
                break;
        
            case 'publisher-remove':
                const data1 = await autopublishSchema.findOne({ Guild: interaction.guild.id });

                if(!data1){
                    return await interaction.reply({ content: `You have not added any channels to the publisher system.` });
                } else {
                    if(!data1.Channel.includes(channel.id)) return await interaction.reply({ content: `The channel you selected has not already been setup, you cannot remove it.` });
                    else {
                        const embed = new EmbedBuilder()
                            .setColor('Random')
                            .setDescription(`${channel} has been removed off of your auto publish list.`)

                        await interaction.reply({ embeds: [embed] });
                        await autopublishSchema.updateOne({ Guild: interaction.guild.id}, { $push: { Channel: channel.id } });
                    }
                }
                break;
        }
    }
};