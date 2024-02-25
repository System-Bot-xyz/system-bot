const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const blacklistusersSchema = require('../../Schemas/blacklistusersSchema');

module.exports = {
    owner: true,
    data: new SlashCommandBuilder()
        .setName('blacklist-user')
        .setDescription('Blacklist a user from using this bot.')
        .addSubcommand(command => command.setName('add').setDescription('Add a user to the blacklist.').addStringOption(option => option.setName('user').setDescription('The user ID you want to blacklist.').setRequired(true)))
        .addSubcommand(command => command.setName('remove').setDescription('Remove a user from the blacklist.').addStringOption(option => option.setName('user').setDescription('The user ID you want to remove from the blacklist.').setRequired(true))),
    async execute(interaction){
        const { options } = interaction;
        if(interaction.user.id !== process.env.DEV_ID) return await interaction.reply({ content: `Only **developers** can use this command!` });

        const user = options.getString('user');
        var data = await blacklistusersSchema.find({ User: user });
        const sub = options.getSubcommand();

        switch (sub) {
            case 'add':
                if(!data){
                    await blacklistusersSchema.create({
                        User: user,
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`The user \`${user}\` has been blacklisted from this bot.`)

                    await interaction.reply({ embeds: [embed] });
                } else if(data){
                    return await interaction.reply({ content: `The user \`${user}\` has already been **blacklisted**.` });
                }
                break;
        
            case 'remove':
                if(!data){
                    return await interaction.reply({ content: `The user \`${user}\` has not been blacklisted.` });
                } else if(data){
                    await blacklistusersSchema.deleteMany({ User: user });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`The user \`${user}\` has been removed from the blacklist.`)

                    await interaction.reply({ embeds: [embed] });
                }
                break;
        }
    }
};