const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economySchema = require('../../Schemas/economySchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw your money.')
        .addStringOption(option => option.setName('amount').setDescription('The amount of money you want to withdraw.').setRequired(true)),
    async execute(interaction){
        const { options, user, guild } = interaction;

        const amount = options.getString('amount');
        const Data = await economySchema.findOne({ Guild: interaction.guild.id, User: user.id });

        if(!Data) return await interaction.reply({ content: `Please create an aconomy account first.` });
        if(amount.startsWith('-')) return await interaction.reply({ content: `You cannot withdraw a negative amount of money.` });

        if(amount.toLowerCase() === 'all'){
            if(Data.Bank === 0) return await interaction.reply({ content: `You have no money to withdraw.` });

            Data.Wallet += Data.Bank;
            Data.Bank = 0;

            await Data.save();

            return await interaction.reply({ content: `All your money has been withdrawed into your wallet.` });
        } else {
            const Converted = Number(amount);

            if(isNaN(Converted) === true) return await interaction.reply({ content: `The amount can only be a number or \`all\`!` });

            if(Data.Bank < parseInt(Converted) || Converted === Infinity) return await interaction.reply({ content: `You dont have enough money in your bank to withdraw it into your wallet.` });

            Data.Wallet += parseInt(Converted);
            Data.Bank -= parseInt(Converted);
            Data.Bank = Math.abs(Data.Bank);

            await Data.save();

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Withdraw Success`)
                .setDescription(`Successfully $${parseInt(Converted)} withdrawed into your wallet.`)

            return await interaction.reply({ embeds: [embed] });
        }
    }
};