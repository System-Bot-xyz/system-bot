const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sourcebin-create')
        .setDescription('Create a sourcebin.')
        .addStringOption(option => option.setName('content').setDescription('The content to put into the sourcebin.').setRequired(true)),
    async execute(interaction){
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const content = options.getString('content');

        const bin = await fetch('https://sourceb.in/api/bins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: [
                    {
                        name: 'sourcebin.txt',
                        content: content,
                    },
                ],
            }),
        });

        if(bin.ok){
            const { key } = await bin.json();
            const link = `https:/sourceb.in/${key}`;

            const embed = new EmbedBuilder()
                .setColor('Ranom')
                .setDescription(`👱‍♂ I have created your **sourcebin** for you!`)

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Open')
                .setURL(link)
                .setStyle(ButtonStyle.Link)
            );

            await interaction.editReply({ embeds: [embed], components: [button] });
        } else {
            return await interaction.editReply({ content: `There was an error while creating your sourcebin... Try again later.` });
        }
    }
    
};