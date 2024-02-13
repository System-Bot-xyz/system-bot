const { SlashCommandBuilder } = require('discord.js');
const { Slots } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Play a game of slots.'),

    async execute(interaction){
        const Game = new Slots({
            message: message,
            isSlashGame: true,
            embed: {
                title: 'Slot Machine',
                color: 'Random',
            },

            slots: ['🍋', '🥥', '🥚', '🍒']
        });

        Game.startGame();
        Game.on('gameover', result => {
            return;
        });
    }
};