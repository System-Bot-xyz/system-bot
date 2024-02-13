const { Snake } = require('discord-gamecord');

module.exports = {
    name: 'snake',
    description: 'Play a game of snake.',

    run: async(client, message, args) => {
        const Game = new Snake({
            message: message,
            isSlashGame: false,
            embed: {
                title: 'Snake',
                overTitle: 'Game Over',
                color: 'Random',
            },
            emojis: {
                board: '⬛',
                food: '🍏',
                up: '⬆',
                down: '⬇',
                left: '⬅',
                right: '➡'
            },
            stopButton: 'Stop',
            timeoutTime: 60000,
            snake: { head: '🟡', body: '🟨', tail: '🟡', over: '💀' },
            foods: ['🍏', '🍒', '🍊', '🍇', '🥕', '🥝', '🌽'],
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameover', result => {
            return;
        });
    }
};