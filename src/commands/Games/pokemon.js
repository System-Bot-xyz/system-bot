const { SlashCommandBuilder } = require('discord.js');
const { GuessThePokemon } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokemon')
        .setDescription('Play a game of pokemon'),
    async execute(interaction){
        const Game = new GuessThePokemon({
            message: interaction,
            isSlashGame: true,
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