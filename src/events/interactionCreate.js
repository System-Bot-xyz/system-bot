const modroleSchema = require('../Schemas/modroleSchema');
const blockcmdSchema = require('../Schemas/blockcmdSchema');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        //owner command
        if(command.owner == true){
            if(interaction.user.id !== process.env.DEV_ID) return await interaction.reply({ content: `You cant use this command.` });
        }

        //mod role system
        if(command.mod){
            var modRoleData = await modroleSchema.find({ Guild: interaction.guild.id });
            if(modRoleData.length > 0){
                var check;
                await modRoleData.forEach(async value => {
                    const mRoles = await interaction.member.roles.cache.map(role => role.id);
                    await mRoles.forEach(async role => {
                        if(role == value.Role) check = true;
                    });
                });

                if(!check) return await interaction.reply({ content: `⚠ Only **moderator** can use this command!` });
            }
        }
        
        //block cmd
        var data = await blockcmdSchema.find({ Guild: interaction.guild.id });
        var match = [];
        await data.forEach(async value => {
            if(value.Command == interaction.commandName) return match.push(value);
        });
        if(match.length > 0){
            return await interaction.reply({ content: `⚠ Sorry! Looks like this server has this command **blocked from use!**` });
        }

        //Return Command
        if (!command) return
        
        try{
            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });
        } 

    },
};