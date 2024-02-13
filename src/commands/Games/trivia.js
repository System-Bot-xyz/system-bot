const { SlashCommandBuilder } = require('discord.js');
const { Trivia } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Play a game of trivia.'),
    async execute(interaction){
        const Game = new Trivia({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'Trivia',
                color: 'Random',
                description: 'You have 60 seconds to guess the answer.'
            },
            emojis: {
                questionButton: '❓',
                answerButton: '✅'
            },
            timeoutTime: 60000,
            buttonStyle: 'Primary',
            trueButtonStyle: 'Success',
            falseButtonStyle: 'Danger',
            mode: 'multiple',
            difficulty: 'medium',
            winMessage: 'You won! The correct answer is {answer}',
            loseMessage: 'You lose! The correct answer is {answer}',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
};