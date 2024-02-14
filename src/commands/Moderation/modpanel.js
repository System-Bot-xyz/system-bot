const { ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Moderate')
        .setType(ApplicationCommandType.User),
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: `You dont have permissions to use this command!` });

        const user = await interaction.guild.members.fetch(interaction.targetId);

        const menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('Moderate')
            .setMinValues(1)
            .setMaxValues(2)
            .setPlaceholder('Nothing selected!')
            .addOptions(
                {
                    label: 'Ban',
                    description: 'Ban the member.',
                    value: `ban ${interaction.targetId}`
                },
                {
                    label: 'Kick',
                    description: 'Kick the member.',
                    value: `kick ${interaction.targetId}`
                },
                {
                    label: 'Timeout',
                    description: 'Timeout the member.',
                    value: `timeout ${interaction.targetId}`
                }
            )
        );

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`🔑 **Moderate** ${user} below!`);

        await interaction.reply({ embeds: [embed], components: [menu] });
    }
};