const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a giveaway.')
        .addSubcommand(command => command.setName('start').setDescription('Starts a giveaway.').addStringOption(option => option.setName('duration').setDescription('The duration of the giveaway.').setRequired(true)).addIntegerOption(option => option.setName('winners').setDescription('The winners of the giveawy.').setRequired(true)).addStringOption(option => option.setName('prize').setDescription('What the winners will win.').setRequired(true)).addChannelOption(option => option.setName('channel').setDescription('The channel your want to start the giveaway.').setRequired(false)).addStringOption(option => option.setName('content').setDescription('The content will be used for giveaway.').setRequired(false)))
        .addSubcommand(command => command.setName('edit').setDescription('Edits a giveaway.').addStringOption(option => option.setName('message-id').setDescription('The id of the giveaway message.').setRequired(true)).addStringOption(option => option.setName('time').setDescription('The added duration of the giveaway.').setRequired(true)).addIntegerOption(option => option.setName('winners').setDescription('The updated number of winners.').setRequired(true)).addStringOption(option => option.setName('prize').setDescription('The new prize of the giveaway.').setRequired(false)))
        .addSubcommand(command => command.setName('end').setDescription('End an existing giveaway.').addStringOption(option => option.setName('message-id').setDescription('The id of the giveaway message.').setRequired(true)))
        .addSubcommand(command => command.setName('reroll').setDescription('Reroll a giveaway.').addStringOption(option => option.setName('message-id').setDescription('The id of the giveaway message.').setRequired(true))),
    async execute(interaction, client){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return await interaction.reply({ content: `You dont have the permissions to use this command!` });

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'start':
                await interaction.reply({ content: `Starting your giveaway...` });

                const duration = ms(interaction.options.getString('duration') || '');
                const winnerCount = interaction.options.getInteger('winners');
                const prize = interaction.options.getString('prize');
                const contentmain = interaction.options.getString('content');
                const channel = interaction.options.getChannel('channel');
                const showchannel = interaction.options.getChannel('channel') || interaction.channel;

                if(!channel && !contentmain){
                    client.giveawayManager.start(interaction.channel, {
                        prize,
                        winnerCount,
                        duration,
                        hostedBy: interaction.user,
                        lastChance: {
                            enabled: false,
                            content: contentmain,
                            threshold: 60000000000_000,
                            embedColor: `Random`
                        },
                        messages: {
                            giveaway: `🎁 **GIVEAWAY** 🎁`,
                            giveawayEnded: `**GIVEAWAY ENDED**`,
                            title: `Ends: {timestamp}\n`,
                            inviteToParticipate: `Winners: {this.winnerCount}\n React with 🎉 to prticipate!`,
                            hostedBy: `Hosted by: {this.hostedBy}`,
                            endedAt: `Ended At`
                        }
                    })
                }
                else if(!channel){
                    client.giveawayManager.start(interaction.channel, {
                        prize,
                        winnerCount,
                        duration,
                        hostedBy: interaction.user,
                        lastChance: {
                            enabled: false,
                            content: contentmain,
                            threshold: 60000000000_000,
                            embedColor: `Random`
                        },
                        messages: {
                            giveaway: `🎁 **GIVEAWAY** 🎁`,
                            giveawayEnded: `**GIVEAWAY ENDED**`,
                            title: `Ends: {timestamp}\n`,
                            inviteToParticipate: `Winners: {this.winnerCount}\n React with 🎉 to prticipate!`,
                            hostedBy: `Hosted by: {this.hostedBy}`,
                            endedAt: `Ended At`
                        }
                    }) 
                }
                else if(!contentmain){
                    client.giveawayManager.start(interaction.channel, {
                        prize,
                        winnerCount,
                        duration,
                        hostedBy: interaction.user,
                        lastChance: {
                            enabled: false,
                            content: contentmain,
                            threshold: 60000000000_000,
                            embedColor: `Random`
                        },
                        messages: {
                            giveaway: `🎁 **GIVEAWAY** 🎁`,
                            giveawayEnded: `**GIVEAWAY ENDED**`,
                            title: `Ends: {timestamp}\n`,
                            inviteToParticipate: `Winners: {this.winnerCount}\n React with 🎉 to prticipate!`,
                            hostedBy: `Hosted by: {this.hostedBy}`,
                            endedAt: `Ended At`
                        }
                    })
                }
                else {
                    client.giveawayManager.start(interaction.channel, {
                        prize,
                        winnerCount,
                        duration,
                        hostedBy: interaction.user,
                        lastChance: {
                            enabled: false,
                            content: contentmain,
                            threshold: 60000000000_000,
                            embedColor: `Random`
                        },
                        messages: {
                            giveaway: `🎁 **GIVEAWAY** 🎁`,
                            giveawayEnded: `**GIVEAWAY ENDED**`,
                            title: `Ends: {timestamp}\n`,
                            inviteToParticipate: `Winners: {this.winnerCount}\n React with 🎉 to prticipate!`,
                            hostedBy: `Hosted by: {this.hostedBy}`,
                            endedAt: `Ended At`
                        }
                    })
                }

                interaction.editReply({ content: `Your giveaway has been started, check ${showchannel} for your giveaway.` });
                break;
        
            case 'edit':
                await interaction.reply({ content: `Editing your giveaway...` });

                const newprize = interaction.options.getString('prize');
                const newduration = interaction.options.getString('duration');
                const newwinners = interaction.options.getInteger('winners');
                const messageId = interaction.options.getString('message-id');

                client.giveawayManager.edit(messageId, {
                    addTime: ms(newduration),
                    newWinnerCount: newwinners,
                    newprize: newprize
                }).then(() => {
                    interaction.editReply({ content: `Your giveaway has been edited.` });
                }).catch(err => {
                    interaction.editReply({ content: `There was an error while editing your giveaway.` });
                })
                break;

            case 'end':
                await interaction.reply({ content: `Ending your giveaway...` });
                const messageId1 = interaction.options.getString('message-id');

                client.giveawayManager.end(messageId1).then(() => {
                    interaction.editReply({ content: `Your giveaway has been ended.` });
                }).catch(err => {
                    interaction.editReply({ content: `There was an error while ending your giveaway.` });
                });
                break;

            case 'reroll':
                await interaction.reply({ content: `Rerolling your giveaway...` });

                const query = interaction.options.getString('message-id');
                const giveaway = client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.prize === query) || client.giveawayManager.giveaways.find((g) => g.guildId && g.messageId === query);

                if(!giveaway) return interaction.editReply({ content: `I could not find any giveaway with the message ID.` });
                const messageId2 = interaction.options.getString('message-id');
                client.giveawayManager.reroll(messageId2, {
                    messages: {
                        congrat: `New Winner: {winners}! \nCongratulations, you won {this.prize}! \n{this.messageURL}`,
                        error: `No valid participant.`
                    }
                }).then(() => {
                    interaction.editReply({ content: `Your giveaway has been rerolled.` });
                }).catch(err => {
                    interaction.editReply({ content: `There was an error while rerolling your giveaway.` });
                })
                break;
        }
    },
};