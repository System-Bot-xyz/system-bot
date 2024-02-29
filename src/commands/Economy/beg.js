const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const economySchema = require('../../Schemas/economySchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Beg for money!'),
    async execute(interaction){
        const { user, guild } = interaction;

        let Data = await economySchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

        let negative = Math.round((Math.random() * posN.length));
        let positive = posN[amount];

        if(!value) return await interaction.reply({ content: `No money for you!` });

        if(Data){
            Data.Wallet += value;
            await Data.save();
        }

        if(value > 0){
            const positiveChoices = [
                `${interaction.guild.name} gave you ${amount}.`,
                'Someone gifted you.',
                'You won at the lottery'
            ]

            const posName = Math.round((Math.random) * positiveChoices.length);

            const embed1 = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Beg`)
                .addFields({ name: 'Beg Result', value: `${positiveChoices[[posName]]} $${value}` })

            await interaction.reply({ embeds: [embed1] });
        } else {
            const negativeChoices = [
                'You left your wallet on the bench, and lost.',
                'Your bank got hacked and the hackers took.',
                'You got mugged and lost.'
            ]

            const negName = Math.round((Math.random() * negativeChoices.length));

            const stringV = `${value}`;

            const nonSymbol = await stringV.slice(1);

            const embed2 = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Beg`)
                .addFields({ name: 'Beg Result', value: `${negativeChoices[[negName]]} $${nonSymbol}` });

            await interaction.reply({ embeds: [embed2] });
        }
    }
};