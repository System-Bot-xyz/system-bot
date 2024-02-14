const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const statusVCSchema = require('../../Schemas/statusVCSchema');
const statusVCDeleteSchema = require('../../Schemas/statusVCDeleteSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status-vc')
        .setDescription('Sets up the status vc system for the server.')
        .addSubcommand(command => command.setName('setup').setDescription('Setup your status vc system.').addChannelOption(option => option.setName('category').setDescription('The category to create the VCs in.').addChannelTypes(ChannelType.GuildCategory).setRequired(true)))
        .addSubcommand(command => command.setName('disable').setDescription('Disable the status vc system.'))
        .addSubcommand(command => command.setName('create').setDescription('Create a status vc based on your current game status.')),
    async execute(interaction){
        const { options } = interaction;
        const sub = options.getSubcommand();
        var data = await statusVCSchema.findOne({ Guild: interaction.guild.id });

        async function sendMessage(message){
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(message);

            await interaction.reply({ embeds: [embed] });
        }

        async function permissions () {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await sendMessage(`⚠ You dont have permissions to use this command!`);
        }

        switch (sub) {
            case 'setup':
                await permissions();
                if(data){
                    await sendMessage(`⚠ Looks like this system is already setup!`)
                } else {
                    var category = options.getChannel('category');
                    await statusVCSchema.create({
                        Guild: interaction.guild.id,
                        Category: category.id
                    });

                    await sendMessage(`🌍 Your status VC system has been set to ${category}. Use /status-vc create to create a status vc!`);
                }
                break;

            case 'disable':
                await permissions();
                if(!data){
                    await sendMessage(`⚠ Looks like there is no status vc system here.`)
                } else {
                    await statusVCSchema.deleteOne({ Guild: interaction.guild.id });
                    await sendMessage(`🌍 I have disabled your status vc system.`)
                }
                break;

            case 'create':
                if(!data){
                    await sendMessage(`⚠ Looks like this system has not been setup yet!`);
                } else {
                    var presence = interaction.member.presence.activities;
                    if(presence == 0){
                        await sendMessage(`⚠ You are not playing anything. (it has to be on your status)`);
                    } else {
                        var category = await interaction.guild.channels.cache.get(data.Category);
                        var channels = await interaction.guild.channels.fetch();

                        var e;
                        await channels.forEach(async c => {
                            if(c.parent == data.Category && c.type == ChannelType.GuildVoice && c.name == presence[0].name) e = true;
                        });

                        if(e) return await sendMessage(`⚠ This VC already exists for your status.`)

                        var channel = await interaction.guild.channels.create({
                            name: `${presence[0].name}`,
                            type: ChannelType.GuildVoice,
                            parent: category
                        });

                        await statusVCDeleteSchema.create({ Guild: interaction.guild.id, Channel: channel.id });
                        await sendMessage(`🌍 Your vc \`${channel.name}\` has been created ${channel}.`);
                    }
                }
                break;
        }
    }
};