const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const captchaSchema = require('../../Schemas/captchaSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('captcha')
        .setDescription('Setup the captcha verification system.')
        .addSubcommand(command => command.setName('setup').setDescription('Setup the captcha verification system.').addRoleOption(option => option.setName('role').setDescription('The roleyou want to be given on verification').setRequired(true)).addStringOption(option => option.setName('captcha').setDescription('The captcha text you want in the image').setRequired(true)))
        .addSubcommand(command => command.setName('disable').setDescription('Disable the captcha verification system.')),

    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You dont have permissions to setup and disabled the verification system.' });

        const Data = await captchaSchema.findOne({ Guild: interaction.guild.id });

        const { options } = interaction;
        const sub = options.getSubcommand();

        switch(sub) {
            case 'setup':

            if(Data) return await interaction.reply({ content: 'The captcha system is already setup here!' });
            else {
                const role = options.getRole('role');
                const captcha = options.getString('captcha');

                await captchaSchema.create({
                    Guild: interaction.guild.id,
                    Role: role.id,
                    Captcha: captcha
                });

                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(':white_check_mark: The captcha system has been setup!')

                await interaction.reply({ embeds: [embed] });
            }
            break;

            case 'disable':
                if(!Data) return await interaction.reply({ content: 'There is no captcha verification system setup here!' });
                else {
                    await captchaSchema.deleteMany({ Guild: interaction.guild.id });

                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(':white_check_mark: The captcha system has been disabled!')

                    await interaction.reply({ embeds: [embed] });
                }
        }
    }

};