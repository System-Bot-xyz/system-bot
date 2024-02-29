const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const economySchema = require('../../Schemas/economySchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('Create your economy account!'),
    async execute(interaction){
        const { user, guild } = interaction;

        let Data = await economySchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Account`)
            .setDescription(`Choose your option.`)
            .addFields({ name: 'Create', value: `Create your account` })
            .addFields({ name: 'Delete', value: `Delete your account` })

        const embed2 = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Created Account`)
            .setDescription(`Your account has been created.`)
            .addFields({ name: ' Success', value: `Your account has been successfully crerated! You have got 1000$ upon creating your account.` })
            .setFooter({ text: `Requested by ${interaction.user.username}` })
            .setTimestamp()

        const embed3 = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Deleted Account`)
            .setDescription(`Your account has been deleted.`)
            .addFields({ name: ' Success', value: `Your economy account has been successfully deleted.` })

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('page1')
            .setEmoji(':white_check_mark:')
            .setLabel('Create')
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId('page2')
            .setEmoji(':x:')
            .setLabel('Delete')
            .setStyle(ButtonStyle.Danger),
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] });

        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {
            if(i.customId === 'page1'){
                if(i.user.id !== interaction.user.id){
                    return i.reply({ content: `Only ${interaction.user.tag} can use this button.` });
                }

                Data = new economySchema({
                    Guild: interaction.guild.id,
                    User: user.id,
                    Bank: 0,
                    Wallet: 1000
                });

                await Data.save();

                await i.update({ embeds: [embed2], components: [] });
            }

            if(i.customId === 'page2'){
                if(i.user.id !== interaction.user.id){
                    return i.reply({ content: `Only ${interaction.user.tag} can use this button.` });
                }

                await Data.deleteMany();

                await i.update({ embeds: [embed3], components: [] });
            }
        })
    }
};