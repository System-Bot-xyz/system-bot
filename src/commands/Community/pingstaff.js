const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const pingstaffSchema = require('../../Schemas/pingstaffSchema');

var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping-staff')
        .setDescription('Pings online staff members.')
        .addSubcommand(command => command.setName('staff-manage').setDescription('Manage the ping staff system.').addRoleOption(option => option.setName('role').setDescription('The role you want members to be able to mention.').setRequired(true)))
        .addSubcommand(command => command.setName('staff').setDescription('Pings all online staff members with a role.').addRoleOption(option => option.setName('role').setDescription('The staff role you want to ping.').setRequired(true))),
    async execute(interaction){
        const { options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'staff-manage':
                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You dont have permissions to manage the ping staff system.` });
                else {
                    const role = options.getRole('role');

                    pingstaffSchema.create({
                        Guild: interaction.guild.id,
                        RoleID: role.id,
                        RoleName: role.name
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`The ping staff system has been setup with the ${role} role.`)

                    await interaction.reply({ embeds: [embed] });
                }
                break;
        
            case 'staff':
                const input = options.getRole('role');
                const id = input.id;
                const data = await pingstaffSchema.findOne({ RoleID: id });
                if(!data) return await interaction.reply({ content: `It looks like the ping staff system has not been enabled for your selected role!` });
                else {
                    if(timeout.includes(interaction.user.id)) return await interaction.reply({ content: `You are on a cooldown for this command! Try again later.` });

                    const members = input.members.filter((member) => {
                        const status = member.presence?.status;
                        return ['online', 'dnd', 'idle'].includes(status);
                    });

                    if(members.size === 0){
                        await interaction.reply({ content: `There is no one online with the role '${input}'... Try again later.` });
                    } else {
                        const memberList = members.map((member) => member.toString()).join('\n+ ');

                        const embed = new EmbedBuilder()
                            .setColor('Random')
                            .setDescription(`Pinged the members to assist you! They should be with you soon!`)

                        await interaction.reply({ embeds: [embed], content: `\>\>\> **Staff Ping Role Alert!**\n\n + ${memberList}\n\n` });

                        timeout.push(interaction.user.id);
                        setTimeout(() => {
                            timeout.shift();
                        }, 60000)
                    }
                }
                break;
        }
    }
};