const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const releasenotesSchema = require('../../Schemas/releasenotesSchema');

module.exports = {
    owner: true,
    data: new SlashCommandBuilder()
        .setName('release-notes')
        .setDescription('Release notes.')
        .addSubcommand(command => command.setName('publish').setDescription('Add new release notes. (developers only)').addStringOption(option => option.setName('updates-notes').setRequired(true)))
        .addSubcommand(command => command.setName('view').setDescription('View the most recent release notes.')),
    async execute(interaction){
        const { options } = interaction;
        const sub = options.getSubcommand();
        var data = await releasenotesSchema.find();

        async function sendMessage(message){
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(message);

            await interaction.reply({ embeds: [embed] });
        }

        async function updateNotes(update, version){
            await releasenotesSchema.create({
                Updates: update,
                Date: Date.now(),
                Developer: interaction.user.username,
                Version: version
            });

            await sendMessage(`I have updated your release notes.`)
        }

        switch (sub) {
            case 'publish':
                if(interaction.user.id !== process.env.DEV_ID){
                    await sendMessage(`⚠ Only **developers** can use this command!`);
                } else {
                    const update = options.getString('updates-notes');
                    if(data.length > 0){
                        await releasenotesSchema.deleteMany();

                        var version = 0;
                        await data.forEach(async value => {
                            version += value.Version + 0.1;
                        });

                        version = Math.round(version * 10) / 10;

                        await updateNotes(update, version+0.1);
                    } else {
                        await updateNotes(update, 1.0);
                    }
                }
                break;
        
            case 'view':
                if(data.length == 0){
                    await sendMessage(`There is no public release notes yet...`);
                } else {
                    var string = ``;
                    await data.forEach(async value => {
                        string += `\`${value.Version}\` \n\n**Update Information**:\n\`\`\`${value.Updates}\`\`\`\n\n**Updating Developer**: ${value.Developer}\n**Update Date**: <t:${Math.floor(value.Date / 1000)}:R>`;
                    });

                    await sendMessage(`**Release Notes** ${string}`);
                }
                break;
        }
    }
};