const { TicTacToe } = require('discord-gamecord');

module.exports = {
    name: 'tictactoe',
    description: 'Play a game of TicTacToe.',

    run: async(client, message, args) => {
        const Game = new TicTacToe({
            message: interaction,
            isSlashGame: false,
            opponent: interaction.options.getUser('user'),
            embed: {
                title: 'TicTacToe',
                color: 'Random',
                statusTitle: 'Status',
                overTitle: 'Game Over'
            },
            emojis: {
                xButton: '❌',
                oButton: '🔘',
                blankButton: '➖'
            },
            mentionUser: true,
            timeoutTime: 60000,
            xButtonStyle: 'Danger',
            oButtonStyle: 'Primary',
            turnMessage: `{emoji} | its turn of player **{player}**.`,
            winMessage: '{emoji} | **{player}** won the TicTacToe Game! Congratulations!',
            tieMessage: `{emoji} | The game tied! No one won the game.`,
            timeoutMessage: '{emoji} | The game went unfinished! No one won the game.',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
};