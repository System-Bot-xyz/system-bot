const { SlashCommandBuilder } = require('discord.js');
const { Snake } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snake')
        .setDescription('Play a game of snake.'),

    async execute(interaction){
        const Game = new Snake({
            message: message,
            isSlashGame: true,
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