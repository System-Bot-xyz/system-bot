const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noteSchema = require('../../Schemas/noteSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('note')
        .setDescription('Create a note by a member.')
        .addSubcommand(command => command.setName('set').setDescription('Set a note for a user.').addUserOption(option => option.setName('user').setDescription('The user to add note to.').setRequired(true)).addStringOption(option => option.setName('note').setDescription('The note to add.').setRequired(true)))
        .addSubcommand(command => command.setName('remove').setDescription('Remove a note from a user.').addUserOption(option => option.setName('user').setDescription('The user to remove note from.').setRequired(true)).addStringOption(option => option.setName('note').setDescription('The note to remove. (copy and paste the note)')))
        .addSubcommand(command => command.setName('check').setDescription('Check notes of a user.').addUserOption(option => option.setName('user').setDescription('The user to check the notes of.').setRequired(true))),
    async execute(interaction){
        const { options } = interaction;
        const sub = options.getSubcommand();
        const user = options.getUser('user');

        async function sendMessage(message){
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(message);

            await interaction.reply({ content: [embed] });
        }

        switch (sub) {
            case 'set':
                var note = options.getString('note');

                await noteSchema.create({
                    Guild: interaction.guild.id,
                    User: user.id,
                    Note: note,
                    Moderator: interaction.user.id
                });

                await sendMessage(`🌍 Your note has been saved.`)

                break;
            case 'remove':
                var note = options.getString('note');
                var del = await noteSchema.deleteOne({ Guild: interaction.guild.id, User: user.id, Note: note });    
                if(del.deletedCount == 0){
                    await sendMessage(`⚠ There is no note found matching \`${note}\``);
                } else {
                    await sendMessage(`🌍 The note \`${note}\` has been removed from ${user}.`);
                }

                break;
            case 'check':
                var data = await noteSchema.find({ Guild: interaction.guild.id });
                var notes = '';
                await data.forEach(async value => {
                    if(value.User == user.id && value.Guild == interaction.guild.id){
                        var moderator = await interaction.guild.members.fetch(value.Moderator);
                        notes += `> **Note**: \`${value.Note}\`\n> **Moderator**: ${moderator}\n\n`;
                    }
                });

                await sendMessage(`🌍 **${user.username}'s Moderator Notes**:\n\n${notes || 'No notes saved!'}`);
                break;
        }
    }
};