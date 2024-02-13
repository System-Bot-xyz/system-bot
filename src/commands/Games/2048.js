const { SlashCommandBuilder } = require('discord.js');
const { TwoZeroFourEight } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('2048')
        .setDescription('Play a game of 2048.'),
    async execute(interaction){
        const Game = new TwoZeroFourEight({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: '2048',
                color: 'Random'
            },
            emojis: {
                up: '⬆',
                down: '⬇',
                left: '⬅',
                right: '➡'
            },
            timeoutTime: 60000,
            buttonStyle: 'Primary',
            playerOnlyMessage: `Only {play} can use these buttons.`
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}