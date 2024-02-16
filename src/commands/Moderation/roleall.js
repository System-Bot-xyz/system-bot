const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-all')
        .setDescription('Give a role to everyone in the server.')
        .addRoleOption(option => option.setName('role').setDescription('The role you want to give everyone.').setRequired(true)),
    async execute(interaction){
        const { options, guild } = interaction;
        const members = await guild.members.fetch();
        const role = options.getRole('role');

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You dont have the permissions to use this command!` });
        else {
            await interaction.reply({ content: `⏳ Giving everyone the ${role.name} role... this may take some time.` });

            let num = 0;
            setTimeout(() => {
                members.forEach(async m => {
                    m.roles.add(role).catch(err => {
                        return;
                    });
                    num++;

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`✔ ${num} members now have the ${role.name} role.`);

                    await interaction.editReply({ content: ``, embeds: [embed] });
                })
            }, 100);
        }
    }
};