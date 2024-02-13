const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const welcomeStatusSchema = require('../../Schemas/welcomeStatusSchema');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('welcome-status')
        .setDescription('Set the welcome status.')
        .addSubcommand(command => command.setName('enable').setDescription('Enable the welcome status system.').addBooleanOption(option => option.setName('send-dm').setDescription('Send a DM when the new member gets put on my status?').setRequired(true)))
        .addSubcommand(command => command.setName('disable').setDescription('Disable the welcome status system.'))
        .addSubcommand(command => command.setName('check').setDescription('Check your welcome status system.')),
    async execute(interaction){
        const { options } = interaction;
        const sub = options.getSubcommand();
        var data = await welcomeStatusSchema.findOne({ Guild: interaction.guild.id });

        async function sendMessage(message){
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(message);

            await interaction.reply({ embeds: [embed] });
        }

        switch (sub) {
            case 'enable':
                if(data){
                    await sendMessage(`⚠ This system is already setup.`)
                } else {
                    const dm = options.getBoolean('send-dm');
                    await welcomeStatusSchema.create({
                        Guild: interaction.guild.id,
                        Enabled: true,
                        DM: dm
                    });

                    await sendMessage(`🌍 Every time someone joins the server, their name and your server will appear on my status!`);
                }

                break;
            case 'disable':
                if(!data){
                    await sendMessage(`⚠ This system is not yet setup.`)
                } else {
                    await welcomeStatusSchema.deleteOne({ Guild: interaction.guild.id });
                    await sendMessage(`�� I have disabled the welcome status system.`)
                }
                break;
            case 'check':
                var main = ``;
                var dmS = ``;

                if(data.Enabled){
                    main = `Every time a member joins the server, their name and this server will be put on my status for at least 5 seconds.`;
                }

                if(data.DM){
                    dmS = `Members **will** receive a direct message letting them know they are on my status!`
                }

                await sendMessage(`🌍 **Your server's welcome status info**:\n\n> You welcome status system is: \`${data.Enabled}\`\n${main}\n\n${dmS}`);
                break;
        }
    }
};