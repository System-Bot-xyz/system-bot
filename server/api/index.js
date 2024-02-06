require("dotenv").config();
const express = require('express');
const router = express.Router();
const { Client, GatewayIntentBits } = require(`discord.js`);
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites ], });

// Handle GET request for /guilds
router.get('/', (req, res) => {
  res.render('api/index', {


    footer_socials_link_1: process.env.Footer_Socials_Link_1,
    footer_socials_link_2: process.env.Footer_Socials_Link_2,
    footer_socials_link_3: process.env.Footer_Socials_Link_3,
    footer_socials_link_4: process.env.Footer_Socials_Link_4,
    footer_copyright: process.env.Footer_Copyright_Text,
    footer_created_by: process.env.Footer_Created_By_Text,
    footer_created_by_name: process.env.Footer_Created_By_Text_Name,
  });
});

module.exports = router;