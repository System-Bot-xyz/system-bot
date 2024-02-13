const { SlashCommandBuilder } = require('discord.js');
const { MatchPairs } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('match-pairs')
        .setDescription('Play a game of match pairs.'),
    async execute(interaction){
        const Game = new MatchPairs({
            message: interaction,
            isSlashGame: true,
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