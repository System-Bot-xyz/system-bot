// Importiere die benötigten Module
require("dotenv").config();
const express = require("express");
const router = express.Router();
const { Client, GatewayIntentBits } = require(`discord.js`);
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites ], });

// Melde den Client mit dem Token an
client.login(process.env.TOKEN);

// Handle GET request for /
router.get("/", async function (req, res) {
  // Erstelle eine leere Liste, um alle User zu speichern
  var allUsers = [];

  // Durchlaufe alle Guilds, zu denen der Client gehört
  for (let guild of client.guilds.cache.values()) {
    // Hole alle Mitglieder der Guild vom API
    await guild.members.fetch();

    // Durchlaufe alle Mitglieder der Guild
    for (let member of guild.members.cache.values()) {
      // Füge den User der Liste hinzu, mit seinem Profilbild und seinem Namen
      allUsers.push({
        name: member.user.username,
        image: member.user.displayAvatarURL(),
      });
    }
  }

  // Erstelle eine HTML-Seite, um die User anzuzeigen
  var html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      /* Definiere den Stil für die User-Karten */
      .user-card {
        width: 200px;
        height: 250px;
        margin: 10px;
        border: 1px solid #ccc;
        display: inline-block;
        vertical-align: top;
      }

      /* Definiere den Stil für die User-Bilder */
      .user-image {
        width: 200px;
        height: 200px;
        object-fit: cover;
      }

      /* Definiere den Stil für die User-Namen */
      .user-name {
        width: 200px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-family: Arial, sans-serif;
        font-size: 18px;
        color: #333;
      }
    </style>
  </head>
  <body>
    <h1>Alle User</h1>
    <div id="user-container">
  `;

  // Füge für jeden User eine User-Karte hinzu
  for (let user of allUsers) {
    html += `
    <div class="user-card">
      <img src="${user.image}" alt="${user.name}" class="user-image">
      <div class="user-name">${user.name}</div>
    </div>
    `;
  }

  // Schließe die HTML-Seite ab
  html += `
    </div>
  </body>
  </html>
  `;

  // Sende die HTML-Seite als Antwort
  res.send(html);
});

// Definiere eine GET-Route für "/list", die alle User als JSON zurückgibt
router.get("/list", async function (req, res) {
  // Erstelle ein leeres Objekt, um alle User nach Guilds zu gruppieren
  var allUsers = {};

  // Durchlaufe alle Guilds, zu denen der Client gehört
  for (let guild of client.guilds.cache.values()) {
    // Hole alle Mitglieder der Guild vom API
    await guild.members.fetch();

    // Erstelle eine leere Liste, um die User der Guild zu speichern
    allUsers[guild.name] = [];

    // Durchlaufe alle Mitglieder der Guild
    for (let member of guild.members.cache.values()) {
      // Wenn das Mitglied ein Bot ist, ignoriere es
      if (member.user.bot) continue;

      // Füge das Mitglied der Liste hinzu, mit seinem Namen und seinen Details
      allUsers[guild.name].push({
        name: member.user.username,
        details: member.user,
      });
    }

    // Sortiere die Liste nach dem Namen der User alphabetisch
    allUsers[guild.name].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Sende das Objekt als JSON-Antwort
  res.json(allUsers);
});

router.get("/count", async function (req, res) {
    
});

// Exportiere den Router, um ihn in der App zu verwenden
module.exports = router;