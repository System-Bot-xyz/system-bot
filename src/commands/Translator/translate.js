const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('translate-google');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate a text!')
        .addStringOption(option => option.setName('text').setDescription('The text you want to translate!').setRequired(true))
        .addStringOption(option => option.setName('to').setDescription('The language you want to translate to!').setRequired(true).addChoices(
            {
                name: 'English',
                value: 'en'
            },
            {
                name: 'German',
                value: 'de'
            },
            {
                name: 'Hindi',
                value: 'hi'
            },
            {
                name: 'Urdu',
                value: 'ur'
            },
            {
                name: 'Turkish',
                value: 'tr'
            },
            {
                name: 'Afrikaans',
                value: 'af'
            },
            {
                name: 'Albanian',
                value: 'sq'
            },
            {
                name: 'Arabic',
                value: 'ar'
            },
            {
                name: 'Polish',
                value: 'pl'
            },
            {
                name: 'Russian',
                value: 'ru'
            },
            {
                name: 'Romnian',
                value: 'ro'
            },
            {
                name: 'Bosnian',
                value: 'bs'
            },
            {
                name: 'Croatian',
                value: 'hr'
            },
            {
                name: 'Czech',
                value: 'cs'
            },
            {
                name: 'Bengali',
                value: 'bn'
            },
            {
                name: 'Belarusian',
                value: 'be'
            },
            {
                name: 'Basque',
                value: 'eu'
            },
            {
                name: 'Azerbaijani',
                value: 'az'
            },
            {
                name: 'Bengali',
                value: 'bn'
            },
            {
                name: 'Armenian',
                value: 'hy'
            },
        ))
        .addBooleanOption(option => option.setName('hidden').setDescription('Should the response be hidden?').setRequired(false)),

    async execute(interaction){
        const { options } = interaction;
        const text = options.getString('text');
        const to = options.getString('to');
        const hidden = options.getBoolean('hidden') || false;
        await interaction.deferReply({ ephemeral: hidden });
        await interaction.editReply({ content: 'Your message is being translated, please wait...' });

        try{
            const translatedText = await translate(text, { to });
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Translation Result')
                .setDescription(`Original: ${text}\nTranslated: ${translatedText}`)

            await interaction.editReply({ content: '', embeds: [embed] });
        } catch(error){
            console.log(error);
            await interaction.editReply({ content: 'Something went wrong, please try again.' });
        }
    }
}