const { SlashCommandBuilder } = require('discord.js');
const { Hangman } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Play a game of hangman.'),
    async execute(interaction){
        const words = ['trees', 'rivers', 'sunsets', 'vampires', 'cultures', 'history', 'landmarks', 'pizza', 'sushi', 'zombies', 'thriller', 'ghosts', 'continents', 'action', 'mountains', 'cults'];
        const wordRandom = Math.floor(Math.random() * sentences.length)

        const Game = new Hangman({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'Hangman',
                color: 'Random'
            },
            hangman: { hat: '🎩', head: '👱‍♂️', shirt: '👕', pants: '🩳', boots: '🥾' },
            customWord: words[wordRandom],
            timeoutTime: 60000,
            winMessage: 'You won the game! The word was **{word}**.',
            loseMessage: 'You lost the game! The word was **{word}**.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
};