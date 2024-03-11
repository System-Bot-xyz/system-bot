const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const joinroleSchema = require('../../Schemas/joinroleSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('joinrole')
        .setDescription('Setup auto role system for your server.')
        .addRoleOption(option => option.setName('role').setDescription('The role to be given when someone joining the server.').setRequired(true)),
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You dont have permissions to run this command.` });

        const role = interaction.options.getRole('role');

        joinroleSchema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
            if(err) throw err;

            if(!data){
                joinroleSchema.create({
                    Guild: interaction.guild.id,
                    RoleID: role.id,
                    RoleName: role.name
                });

                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`${role} has been successfully set as a join role.`)
                    .setFooter({ text: `${interaction.guild.name}` })
                    .setTimestamp()

                return interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ content: `Join Role has already been set up.` });
            }
        })
    }
};