const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    owner: true,
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluate javascript code. (dev only)')
        .addStringOption(option => option.setName('code').setDescription('The code to evaluate').setRequired(true)),
    async execute(interaction){
        async function sendMessage(message){
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(message);

            await interaction.reply({ embeds: [embed] });
        }

        if(interaction.member.id !== process.env.DEV_ID) return await sendMessage(`⚠ Only **developers** can use this command!`);

        const { options } = interaction;

        var code = options.getString('code');
        var output;

        try {
            output = await eval(code);
        } catch (error) {
            output = error.toString();
        }

        var replyString = `**Input**:\n\`\`\`js\n${code}\n\`\`\`\n\n**Output**:\n\`\`\`js\n${output}\n\`\`\``;

        if(interaction.replied){
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(replyString);

            await interaction.editReply({ content: '', embeds: [embed] });
        } else {
            await sendMessage(replyString);
        }
    }
};