const { Minesweeper } = require('discord-gamecord');

module.exports = {
    name: 'minesweeper',
    description: 'Play a game of minesweeper.',

    run: async(client, message, args) => {
        const Game = new Minesweeper({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'Minesweeper',
                color: 'Random',
                description: 'Click on the buttons to reveal the block except mines.'
            },
            emojis: { flag: '', mine: '' },
            mines: 5,
            timoutTime: 60000,
            winMessage: 'Congrats! You won the game.',
            loseMessage: 'Better luck next time! You lost the game.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
};