const { GuessThePokemon } = require('discord-gamecord');

module.exports = {
    name: 'pokemon',
    description: 'Play a game of pokemon.',

    run: async(client, message, args) => {
        const Game = new GuessThePokemon({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Who\'s the pokemon',
                color: 'Random'
            },
            timeoutTime: 60000,
            winMessage: 'You guessed it right! It was a {pokemon}.',
            loseMessage: 'Better luck next time! It was a {pokemon}.',
            errMessage: 'Unable to fetch pokemon.',
            playerOnlyMessage: 'Only {player} can use these buttons.',
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
};