const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'This is the say command!',
    run: async(client, message, args) => {
        const channel = message.mentions.channels.fetch();
        const m = args.slice(1).join(' ');

        if(!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.channe.send(`You don't have permission to use this command!`);
        if(!channel) return message.channel.send(`Please provide a channel for me to send a message!`);
        if(!m) return message.channel.send(`Please provide a message for me to say!`);

        channel.send(m);
    }
};