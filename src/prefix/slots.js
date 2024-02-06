const { Slots } = require('discord-gamecord');

module.exports = {
    name: 'slots',
    description: 'Play a game of slots.',

    run: async(client, message, args) => {
        const Game = new Slots({
            message: message,
            isSlashGame: false,
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