const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('impersonate')
        .setDescription('Impersonate a user.')
        .addUserOption(option => option.setName('user').setDescription('The user you want to impersonate.').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('The message you want to say.').setRequired(true)),
    async execute(interaction){
        const { options } = interaction;

        const member = options.getUser('user');
        const message = options.getString('message');

        await interaction.channel.createWebhook({
            name: member.username,
            avatar: member.displayAvatarURL({ dynamic: true })
        }).then((webhook) => {
            webhook.send({ content: message });
            setTimeout(() => {
                webhook.delete();
            });
        });

        await interaction.reply({ content: `${member} has been impersonate below.` });
    }
};