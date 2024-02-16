const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const welcomeSetupSchema = require('../../Schemas/welcomeSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome-message')
        .setDescription('Set a custom welcome message for the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('message').setDescription('Variables: {SERVER_MEMBER}, {SERVER_NAME}, {USER_MENTION}, {USER_NAME}.').setRequired(true))
        .addBooleanOption(option => option.setName('use_embed').setDescription('Use embed for welcome message.').setRequired(false)),

    async execute(interaction){
        try {
            const guildId = interaction.guild.id;
            const welcomeMessage = interaction.options.getString('message');
            const useEmbed = interaction.options.getBoolean('use_embed') || false;

            let existingSetup = await welcomeSetupSchema.findOne({ guildId });
            if(!existingSetup){
                return await interaction.reply({ content: 'Please setup the welcome system first using `/welcome-setup`.', ephemeral: true });
            }

            existingSetup.welcomeMessage = welcomeMessage;
            existingSetup.useEmbed = useEmbed;

            await existingSetup.save();

            await interaction.reply({ content: 'Custom welcome message set successfully.', ephemeral: true });
        } catch (error) {
            console.error('error', error);
        }
    }
}