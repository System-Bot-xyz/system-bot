const { TwoZeroFourEight } = require('discord-gamecord');

module.exports = {
    name: '2048',
    description: 'Play a game of 2048.',

    run: async(client, message, args) => {
        const Game = new TwoZeroFourEight({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: '2048',
                color: 'Random'
            },
            emojis: {
                up: '⬆',
                down: '⬇',
                left: '⬅',
                right: '➡'
            },
            timeoutTime: 60000,
            buttonStyle: 'Primary',
            playerOnlyMessage: `Only {play} can use these buttons.`
        });
        
        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
};