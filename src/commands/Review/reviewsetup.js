const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const reviewSchema = require('../../Schemas/reviewSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('review-setup')
        .setDescription('Set the review system.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel where you want all reviews to be sent to.').setRequired(true).addChannelTypes(ChannelType.GuildText)),
    async execute(interaction, client) {
        try {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
                await interaction.reply({ content: `You must have **Administrator** permissions to use this command.`, ephemeral: true });

                return;
            }

            const { channel, options, guildId } = interaction;
            const revChannel = options.getChannel('channel');

            const embed = new EmbedBuilder()

            const data = await reviewSchema.findOne({ Guild: guildId });

            if(!data){
                await reviewSchema.create({
                    Guild: guildId,
                    Channel: revChannel.id,
                });

                embed.setColor('Random')
                .setDescription(`All reviews will be sent to ${channel}`);
            } else if (data){
                const ch = client.channels.cache.get(data.Channel);
                embed.setColor('Random')
                .setDescription(`Your review channel has already been set to ${ch}`);
            }

            await interaction.reply({ embeds: [embed] });
        } catch(err){
            console.log(err);
            await interaction.reply({ content: `An error occured`, ephemeral: true });
        }
    },
};