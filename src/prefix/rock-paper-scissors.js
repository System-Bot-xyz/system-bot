const { RockPaperScissors } = require('discord-gamecord');

module.exports = {
    name: 'rock-paper-scissors',
    description: 'Play a rock paper scissors game.',

    run: async(client, message, args) => {
        const { options } = interaction;
        const opponent = options.getUser('opponent');

        const Game = new RockPaperScissors({
            message: interaction,
            isSlashGame: false,
            opponent: opponent,
            embed: {
                title: 'Rock Paper Scissors',
                color: '#5865F2',
                description: 'Press a button below to make a choice.'
            },
            buttons: {
                rock: 'Rock',
                paper: 'Paper',
                scissors: 'Scissors'
            },
            emojis: {
                rock: '⛰️',
                paper: '🧻',
                scissors: '✂'
            },
            mentionUser: true,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            pickMessage: 'You choose {emoji}.',
            winMessage: '**{player}** won the Game! Congratulations!',
            tieMessage: 'The Game tied! No one won the game!',
            timeoutMessage: 'The Game went unfinished! No one won the game!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
        });

        Game.startGame();
    }
};