const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const welcomeSetupSchema = require('../../Schemas/welcomeSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome-test')
        .setDescription('Test the welcome message for the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction){
        try {
            const guildId = interaction.guild.id;

            const existingSetup = await welcomeSetupSchema.findOne({ guildId });
            if(!existingSetup) {
                return await interaction.reply({ content: 'Please setup the welcome system first using `/welcome-setup`.' });
            };

            const channel = interaction.guild.channels.cache.get(existingSetup.channelId);
            if(!channel){
                return await interaction.reply({ content: 'The configured welcome system channel does not exist.' });
            };

            const userAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });

            let messageContent = existingSetup.welcomeMessage
                .replace('{SERVER_MEMBER}', interaction.guild.memberCount)
                .replace('{USER_MENTION}', `<@${interaction.user.id}>`)
                .replace('{USER_NAME}', interaction.user.username)
                .replace('{SERVER_NAME}', interaction.guild.name);

            if(existingSetup.useEmbed){
                const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle('Welcome to the **{SERVER_NAME}** server!')
                    .setDescription(messageContent)
                    .setThumbnail(userAvatar)
                    .setFooter({ text: interaction.guild.name })
                    .setTimestamp();

                await channel.send({ content: `<@${interaction.user.id}`, embeds: [embed] });
            } else {
                await channel.send(messageContent);
            }

            await interaction.reply({ content: `Test welcome message sent successfully. ${channel}` });
        } catch (error) {
            console.error('error', error);
        }
    },
};