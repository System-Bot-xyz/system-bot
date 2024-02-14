const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const msgleaderboardSchema = require('../../Schemas/msgleaderboardSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message-leaderboard')
        .setDescription('See the leaderboard who have the most messages.')
        .addSubcommand(command => command.setName('user').setDescription('A specific users messages + leaderboard standing.').addUserOption(option => option.setName('user').setDescription('The user to check.').setRequired(true)))
        .addSubcommand(command => command.setName('total').setDescription('The total message leaderboard.')),
    async execute(interaction){
        const { options } = interaction;
        const sub = options.getSubcommand();
        
        switch (sub) {
            case 'user':
                async function total(){
                    var data = await msgleaderboardSchema.find({ Guild: interaction.guild.id });
                    var standings = [];
                    await data.forEach(async d => {
                        standings.push({
                            user: d.User,
                            messages: d.Messages
                        });
                    });

                    return standings;
                }

                async function lbUser(user){
                    var data = await msgleaderboardSchema.find({ Guild: interaction.guild.id });
                    if(!data) return 'No data found';

                    if(user){
                        var standings = await total();
                        standings.sort((a, b) => b.messages - a.messages);
                        return standings.findIndex((item) => item.user === user) + 1;
                    }
                }

                const user = options.getUser('user');
                const data = await msgleaderboardSchema.findOne({ Guild: interaction.guild.id, User: user.id });
                if(!data) return await interaction.reply({ content: `⚠ Looks like you have 0 messages history logged with this bot!` });
                else {
                    var t = await total().then(async data => {return data.length});

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setTitle(`${user.username}'s Message Standings`)
                        .addFields({ name: 'Total Messages', value: `\`${data.Messages}\`` })
                        .addFIelds({ name: 'Leaderboard Standing', value: `\`#${await lbUser(user.id)}/${t}\``})
                        .setTimestamp();

                    await interaction.reply({ embeds: [embed] });
                }
                break;

            case 'total':
                const data2 = await msgleaderboardSchema.findOne({ Guild: interaction.guild.id });
                if(!data2) return await interaction.reply({ content: `⚠ Looks like you have 0 message history logged with this bot!` });
                else {
                    var leaderboard = await total();
                    leaderboard.sort((a, b) => b.messages - a.messages);
                    var output = leaderboard.slice(0, 10);

                    var string;
                    var num = 1;
                    await output.forEach(async value => {
                        const member = await interaction.guild.members.cache.get(value.user);
                        string += `#${num} Member: **${member.user.username}**, Total Messages: \`${value.messages}\`\n`;
                        num++;
                    });

                    string = string.replace('undefined', '');

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setTitle(`${interaction.guild.name}'s Message Leaderboard 1-10`)
                        .setDescription(`${string}`);

                    await interaction.reply({ embeds: [embed] });
                }
                break;
        }
    }
};