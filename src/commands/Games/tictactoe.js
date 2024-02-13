const { SlashCommandBuilder } = require('discord.js');
const { TicTacToe } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tic-tac-toe')
        .setDescription('Play a game tic tac toe.')
        .addUserOption(option => option.setName('user').setDescription('The opponent').setRequired(true)),
    async execute(interaction){
        const Game = new TicTacToe({
            message: interaction,
            isSlashGame: true,
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
}