const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economySchema = require('../../Schemas/economySchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Deposit your money.')
        .addStringOption(option => option.setName('amount').setDescription('The amount of money you want to deposit.').setRequired(true)),
    async execute(interaction){
        const { options, user, guild } = interaction;

        const amount = options.getString('amount');
        const Data = await economySchema.findOne({ Guild: interaction.guild.id, User: user.id });

        if(!Data) return await interaction.reply({ content: `Please create an aconomy account first.` });
        if(amount.startsWith('-')) return await interaction.reply({ content: `You cannot deposit a negative amount of money.` });

        if(amount.toLowerCase() === 'all'){
            if(Data.Wallet === 0) return await interaction.reply({ content: `You have no money to deposit.` });

            Data.Bank += Data.Wallet;
            Data.Wallet = 0;

            await Data.save();

            return await interaction.reply({ content: `All your money has been deposited.` });
        } else {
            const Converted = Number(amount);

            if(isNaN(Converted) === true) return await interaction.reply({ content: `The amount can only be a number or \`all\`!` });

            if(Data.Wallet < parseInt(Converted) || Converted === Infinity) return await interaction.reply({ content: `You dont have enough money in your wallet to deposit it into your bank account.` });

            Data.Bank += parseInt(Converted);
            Data.Wallet -= parseInt(Converted);
            Data.Wallet = Math.abs(Data.Wallet);

            await Data.save();

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Deposit Success`)
                .setDescription(`Successfully $${parseInt(Converted)} deposited into your bank account.`)

            return await interaction.reply({ embeds: [embed] });
        }
    }
};