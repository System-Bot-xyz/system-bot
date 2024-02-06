const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const ticketSchema = require('../../Schemas/ticketSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Sets up the ticket system for the server.')
        .addChannelOption(option => option.setName('category').setDescription('The category to create the ticket channels in.').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the ticket panel to..').setRequired(true).addChannelTypes(ChannelType.GuildText))
        .addStringOption(option => option.setName('color').setDescription('The color for the ticket panel.')
        .addChoices(
            { name: 'Red', value: 'Red' },
            { name: 'Blue', value: 'Blue' },
            { name: 'Green', value: 'Green' },
            { name: 'Yellow', value: 'Yellow' },
            { name: 'Purple', value: 'Purple' },
            { name: 'Pink', value: 'Pink' },
            { name: 'Orange', value: 'Orange' },
            { name: 'White', value: 'White' },
            { name: 'Gray', value: 'Gray' },
            { name: 'Random', value: 'Random' },
        ).setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('The description for the ticket system.').setRequired(true).setMinLength(1).setMaxLength(1000))
        .addStringOption(option => option.setName('support-online-time').setDescription('Set the during time when the support is online.').setRequired(true).setMinLength(1).setMaxLength(1000))
        .addStringOption(option => option.setName('apply-duration').setDescription('Set the apply duration.(2h, 4h, 12h)').setRequired(true).setMinLength(1).setMaxLength(1000))
        .addRoleOption(option => option.setName('role').setDescription('The role to ping when a ticket is created.').setRequired(true))
        .addChannelOption(option => option.setName('ticket-logs').setDescription('The channel for the transcripts to be sent to.').setRequired(true)),

    async execute(interaction, client){
        try {
            const { options, guild } = interaction;
            const GuildID = interaction.guild.id;
            const category = options.getChannel('category');
            const panel = options.getChannel('channel');
            const color = options.getString('color');
            const msg = options.getString('description');
            const supportonlinetime = options.getString('support-online-time');
            const applyduration = options.getString('apply-duration');
            const role = options.getRole('role');
            const logs = options.getChannel('ticket-logs');

            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({ content: 'You do not have the permissions to do that.', ephemeral: true });
            }

            const data = await ticketSchema.findOne({ GuildID: GuildID });
            if(data) return await interaction.reply({ content: 'You already have a ticket system setup.', ephemeral: true });
            else {
                await ticketSchema.create({
                    GuildID: GuildID,
                    Category: category.id,
                    Channel: panel.id,
                    msg: msg,
                    supportonlinetime: supportonlinetime,
                    applyduration: applyduration,
                    color: color,
                    Role: role.id,
                    Logs: logs.id,
                })

                const embed = new EmbedBuilder()
                    .setColor(`${color}`)
                    .setTitle('Ticket Panel')
                    .setDescription(`${msg}`)
                    .addFields(
                        { name: 'Support Online Time', value: `${supportonlinetime}` },
                        { name: 'Apply Duration', value: `${applyduration}` },
                    )

                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('General')
                        .setLabel('🎫 Create Ticket')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('Video Report')
                        .setLabel('📷 Video Report')
                        .setStyle(ButtonStyle.Secondary)
                )

                const channel = client.channels.cache.get(panel.id);
                await channel.send({ embeds: [embed], components: [button] });

                await interaction.reply({ content: `The ticket pnael has been sent to **${channel}**.`, ephemeral: true });
            }
        } catch (err) {
            console.log(err);
        }
    }
};