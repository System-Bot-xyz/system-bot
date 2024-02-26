const { SlashCommandBuilder } = require('discord.js');
const blacklistserverSchema = require('../../Schemas/blacklistserverSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist-server')
        .setDescription('Add a server to the blacklist.')
        .addSubcommand(command => command.setName('add').setDescription('Add a server to the blacklist.').addStringOption(option => option.setName('server').setDescription('The server ID you want to blacklist.').setRequired(true)))
        .addSubcommand(command => command.setName('remove').setDescription('Remove a server from the blacklist.').addStringOption(option => option.setName('server').setDescription('The server ID you want to remove from the blacklist.').setRequired(true))),
    async execute(interaction){
        const { options } = interaction;
        if(interaction.user.id !== process.env.DEV_ID) return await interaction.reply({ content: `Only **developers** can use this command!` });

        const server = options.getString('server');
        const sub = options.getSubcommand();
        const data = await blacklistserverSchema.findOne({ Guild: server });

        switch (sub) {
            case 'add':
                if(!data){
                    await blacklistserverSchema.create({
                        Guild: server,
                    });

                    await interaction.reply({ content: `**Adding Blacklist...**` });
                    setTimeout(async () => {
                        await interaction.editReply({ content: `**Indexing Servers...**`, ephemeral: true });

                        const check = await client.guilds.cache.get(server);
                        if(check){
                            await check.leave();
                            setTimeout(async () => {
                                await interaction.editReply({ content: `Blacklist **complete**! I have also gone ahead and left the server \`${server}\` as i was already in it.` });
                            }, 3000);
                        } else {
                            setTimeout(async () => {
                                await interaction.editReply({ content: `Blacklist **complete**! I cannot join \`${server}\` anymore.` });
                            });
                        }
                    }, 2000);
                } else {
                    return await interaction.reply({ content: `The server \`${server}\` is already **blacklisted**!` });
                }
                break;
        
            case 'remove':
                if(!data){
                    return await interaction.reply({ content: `The server \`${server}\` is not **blacklisted**!` });
                } else {
                    await blacklistserverSchema.deleteMany({ Guild: server });
                    return await interaction.reply({ content: `The server \`${server}\` has been removed from the blacklist!` });
                }
                break;
        }
    }
};