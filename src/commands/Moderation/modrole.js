const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const modroleSchema = require('../../Schemas/modroleSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('mod-role')
        .setDescription('Setup the moderator role for the server.')
        .addSubcommand(command => command.setName('add').setDescription('Add a mod role to the database.').addRoleOption(option => option.setName('role').setDescription('The mod role to add').setRequired(true)))
        .addSubcommand(command => command.setName('remove').setDescription('Remove a role from the mod role database.').addRoleOption(option => option.setName('role').setDescription('The mod role to remove').setRequired(true)))
        .addSubcommand(command => command.setName('check').setDescription('Check the mod role(s) in the database.')),
    async execute(interaction){
        const { options } = interaction;
        const sub = options.getSubcommand();
        var data = await modroleSchema.find({ Guild: interaction.guild.id });

        async function sendMessage(message){
            const embed = new EmbedBuilder()
              .setColor("Random")
              .setDescription(message);

            await interaction.reply({ embeds: [embed] });
        }

        async function checkData(add){
            var check;
            var role = options.getRole('role');

            await data.forEach(async value => {
                if(value.Role == role.id) return check = true;
            });

            return check;
        }

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await sendMessage(`⚠ You dont have permissions to use this command!`);

        switch(sub) {
            case 'add': 
                var check = await checkData(true);
                var role = options.getRole('role');

                if(check){
                    return await sendMessage(`⚠ Looks like that is already a mod role!`);
                } else{
                    await modroleSchema.create({
                        Guild: interaction.guild.id,
                        Role: role.id
                    });

                    return await sendMessage(`🌍 I have added ${role} as mod role!`)
                }
                break;

            case 'remove':
                var check = await checkData(true);
                var role = options.getRole('role');

                if(!check){
                    return await sendMessage(`⚠ Looks like that role is not a mod role, so i cant remove it!`);
                } else {
                    await modroleSchema.deleteOne({ Guild: interaction.guild.id, Role: role.id });
                    return await sendMessage(`🌍 ${role} is no longer a mod role!`);
                }
                break;

            case 'check':
                var values = [];
                await data.forEach(async value => {
                    if(!value.Role) return;
                    else {
                        var r = await interaction.guild.roles.cache.get(value.Role);
                        values.push(`**Role Name**: ${r.name}\n**Role ID**: ${r.id}`);
                    }
                });

                if(values.length > 0){
                    await sendMessage(`🌍 **Moderator Roles**\n\n${values.join('\n')}`);
                } else {
                    await sendMessage(`⚠ Looks like there are no mod roles here!`);
                }
                break;
        }
    }
};