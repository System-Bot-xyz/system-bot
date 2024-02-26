const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const ghostpingSchema = require('../../Schemas/ghostpingSchema');
const ghostnumSchema = require('../../Schemas/ghostnumSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('anti-ghostping')
        .setDescription('Setup the ghostping system for the server.')
        .addSubcommand(command => command.setName('setup').setDescription('Setup the ghost ping system for the server.'))
        .addSubcommand(command => command.setName('disable').setDescription('Reset the ghost ping system for the server.'))
        .addSubcommand(command => command.setName('number-reset').setDescription('Set the number of messages to send.').addUserOption(option => option.setName('user').setDescription('The user you want to reset the number of ghost pings of.').setRequired(true))),
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You dont have permissions to manage the anti ghost ping system.` });

        const { options } = interaction;
        const sub = options.getSubcommand();

        const Data = await ghostpingSchema.findOne({ Guild: interaction.guild.id });

        switch (sub) {
            case 'setup':
                if(Data) return await interaction.reply({ content: `You already have the anti ghost ping system setup.` });
                else {
                    await ghostpingSchema.create({
                        Guild: interaction.guild.id
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`:white_check_mark: The anti ghost ping system has been setup!`)

                    await interaction.reply({ embeds: [embed] });
                }
                break;
        
            case 'disable':
                if(!Data) return await interaction.reply({ content: `There is no anti ghost ping system setup here!` });
                else {
                    await ghostpingSchema.deleteMany({ Guild: interaction.guild.id });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`:white_check_mark: The anti ghost ping system has been disabled!`)

                    await interaction.reply({ embeds: [embed] });
                }
                break;

            case 'number-reset':
                const member = options.getUser('user');
                const data = await ghostnumSchema.findOne({ Guild: interaction.guild.id, User: member.id });

                if(!data) return await interaction.reply({ content: `This member doesnt have any ghost pings yet.` });
                else {
                    await data.deleteOne({ User: member.id });
                    await interaction.reply({ content: `${member}'s ghost ping number is back at 0.` });
                }
                break;
        }
    }
};