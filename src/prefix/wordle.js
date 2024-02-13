const { Wordle } = require('discord-gamecord');

module.exports = {
    name: 'wordle',
    description: 'Play a wordle game.',

    run: async(client, message, args) => {
        const Game = new Wordle({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: `Wordle`,
                color: '#5865F2',
                description: 'Press a button below to make a choice.'
            },
            customWord: null,
            timeoutTime: 60000,
            winMessage: `You won! The word was **{word}**.`,
            loseMessage: `You lose! The word was **{word}**.`,
            playerOnlyMessage: `Only {player} can use these buttons.`
        });

        Game.startGame();
        Game.on('gameover', result => {
            return;
        });
    }
};