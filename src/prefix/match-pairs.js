const { MatchPairs } = require('discord-gamecord');

module.exports = {
    name: 'match-pairs',
    description: 'Play a game of match pairs.',

    run: async(client, message, args) => {
        const Game = new MatchPairs({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: `Match Pairs`,
                color: '#5865F2',
                description: 'Click on the buttons to match emojis with their pairs.'
            },
            timeoutTime: 60000,
            emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🥬', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥒', '🌶', '🌽'],
            winMessage: 'You won the game! You turned a total of `{titleTurned}`.',
            loseMessage: 'You lost the game! You turned a total of `{titleTurned}`.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
};