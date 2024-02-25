const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('webhook')
        .setDescription('Manage and edit your webhooks.')
        .addSubcommand(command => command.setName('create').setDescription('Creates a webhook channel.').addChannelOption(option => option.setName('channel').setDescription('The channel you want to create your webhook in.').addChannelTypes(ChannelType.GuildText).setRequired(true)).addStringOption(option => option.setName('name').setDescription('The name that you want the webhook to have.').setRequired(true).setMinLength(1).setMaxLength(80)).addStringOption(option => option.setName('iron-url').setDescription('The icon you want the webhook to have.').setRequired(true).setMinLength(1).setMaxLength(200)))
        .addSubcommand(command => command.setName('edit').setDescription('Edits a webhook for you.').addStringOption(option => option.setName('webhook-id').setDescription('The ID of your webhook.').setRequired(true)).addStringOption(option => option.setName('webhook-token').setDescription('The token of your webhook.').setMinLength(10).setMaxLength(200).setRequired(true)).addStringOption(option => option.setName('new-name').setDescription('The new name of your webhook.').setRequired(true).setMinLength(1).setMaxLength(80)))
        .addSubcommand(command => command.setName('deelte').setDescription('Delete a webhook.').addStringOption(option => option.setName('webhook-id').setDescription('The ID of your webhook.').setMinLength(10).setMaxLength(200).setRequired(true)).addStringOption(option => option.setName('webhook-token').setDescription('The token for your webhook.').setRequired(true).setMinLength(10).setMaxLength(200))),
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You must be an admin to manage webhooks on this server.` });
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'create':
                await interaction.deferReply({ ephemeral: true });

                const name = await interaction.options.getString('name');
                const icon = await interaction.options.getString('icon-url');
                const channel = await interaction.options.getChannel('channel');

                const webhook = await channel.createWebhook({
                    name: name,
                    avatar: icon,
                    channel: channel
                }).catch(err => {
                    return interaction.editReply({ content: `There was an **error** while creating your webhook: \`${err}\`.` });
                });

                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`:white_check_mark: Your webhook has been created!`)
                    .addFields({ name: 'Webhook Name', value: `> ${name}`, inline: true })
                    .addFields({ name: 'Webhook Channel', value: `> ${channel}`, inline: true })
                    .addFields({ name: 'Webhook URL', value: `> https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`, inline: true })
                    .addFields({ name: 'Webhook Icon', value: `> ${icon}`, inline: true })

                await interaction.editReply({ embeds: [embed] });

                try{
                    await webhook.send({ embeds: [new EmbedBuilder().setColor('Random').setDescription(`Hello from your webhook!`)] });
                } catch(err){
                    return;
                }
                break;
        
            case 'edit':
                await interaction.deferReply({ ephemeral: true });

                const token = await interaction.options.getString('webhook-token');
                const id = await interaction.options.getString('webhook-id');

                let newname = await interaction.options.getString('new-name');

                const editwebhook = await interaction.guild.fetchWebhooks();

                await Promise.all(editwebhook.map(async webhook => {
                    if(webhook.token !== token || webhook.id !== id) await interaction.editReply({ content: `Searching... no results found.` });
                    else {
                        if(!newname) newname = webhook.name;
                        let oldname = webhook.name;
                        await webhook.edit({
                            name: newname
                        }).catch(err => {
                            return interaction.editReply({ content: `There is something wrong, i may be missing permissions.` });
                        })

                        const embed = new EmbedBuilder()
                            .setColor('Random')
                            .setDescription(`:white_check_mark: Your webhook has been edited!`)
                            .addFields({ name: 'Webhook Name', value: `> ${oldname} => ${newname}`, inline: true })

                        await interaction.editReply({ embeds: [embed], content: '' });
                    }
                }))
                break;
            case 'delete':
                await interaction.deferReply({ ephemeral: true });

                const deltoken = await interaction.options.getString('webhook-token');
                const delid = await interaction.options.getString('webhook-id');

                const delwebhook = await interaction.guild.fetchWebhooks();

                await Promise.all(delwebhook.map(async webhook => {
                    if(webhook.token !== deltoken || webhook.id !== delid) return await interaction.editReply({ content: `Searching... nothing found yet.` });
                    else {
                        await webhook.delete().catch(err => {
                            return interaction.editReply({ content: `There is something wrong, i may be missing permissions.` });
                        })

                        await interaction.editReply({ content: `Deleted your webhook!` });
                    }
                }))
                break;
        }
    }
};