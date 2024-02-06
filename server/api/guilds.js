require("dotenv").config();
const express = require('express');
const router = express.Router();
const { Client, GatewayIntentBits } = require(`discord.js`);
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites ], });

// Log in to Discord API
client.login(process.env.TOKEN);

// Handle GET request for /guilds
router.get('/', (req, res) => {
    // Get list of all guilds
    const guilds = client.guilds.cache.map(async (guild) => ({
      id: guild.id,
      name: guild.name,
      inviteLink: `https://discord.gg/${guild.vanityURLCode || 'invite-code-not-found'}`,
      ownerName: (await guild.fetchOwner()).user.username,
      ownerDisplayName: (await guild.fetchOwner()).displayName,
      memberCount: guild.memberCount,
      roles: guild.roles.cache.map((role) => ({
        id: role.id,
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions.toArray(),
      })),
      assignedRoles: guild.members.cache.map((member) => ({
        id: member.id,
        roles: member.roles.cache.map((role) => role.id),
      })),
    }));
  
    Promise.all(guilds).then((guilds) => {
      res.json({ guilds });
    });
});
router.get('/count', (req, res) => {
    // Get number of guilds
    const guildsCount = client.guilds.cache.size;
    res.json({ guildsCount });
});

module.exports = router;