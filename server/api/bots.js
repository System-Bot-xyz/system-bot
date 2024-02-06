// Importiere die benötigten Module
require("dotenv").config();
var express = require("express");
var router = express.Router();
const { Client, GatewayIntentBits } = require(`discord.js`);

// Erstelle einen neuen Client mit den erforderlichen Intents
var client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers ], });

// Melde den Client mit dem Token an
client.login(process.env.TOKEN);

// Handle GET request for /
router.get("/", async function (req, res) {
  // Erstelle eine leere Liste, um alle Bots zu speichern
  var allBots = [];

  // Durchlaufe alle Guilds, zu denen der Client gehört
  for (let guild of client.guilds.cache.values()) {
    // Hole alle Mitglieder der Guild vom API
    await guild.members.fetch();

    // Durchlaufe alle Mitglieder der Guild
    for (let member of guild.members.cache.values()) {
      // Wenn das Mitglied ein Bot ist, füge es der Liste hinzu, mit seinem Icon und seinem Invite Link
      if (member.user.bot) {
        // Hole die URL des Icons des Bots
        let iconURL = member.user.displayAvatarURL();

        // Erstelle einen Invite Link für den Bot mit den erforderlichen Berechtigungen
        let inviteURL = `https://discord.com/oauth2/authorize?client_id=${member.user.id}&scope=bot&permissions=8`;

        // Füge den Bot der Liste hinzu, mit seinem Namen, seinem Icon und seinem Invite Link
        allBots.push({
          name: member.user.username,
          icon: iconURL,
          invite: inviteURL,
        });
      }
    }
  }

  // Sende die Liste als JSON-Antwort
  res.json({ allBots });
});

// Definiere eine GET-Route für "/bots", die alle Bots als JSON zurückgibt
router.get("/list", async function (req, res) {
  // Erstelle ein leeres Objekt, um alle Bots nach Guilds zu gruppieren
  var allBots = {};

  // Durchlaufe alle Guilds, zu denen der Client gehört
  for (let guild of client.guilds.cache.values()) {
    // Hole alle Mitglieder der Guild vom API
    await guild.members.fetch();

    // Erstelle eine leere Liste, um die Bots der Guild zu speichern
    allBots[guild.name] = [];

    // Durchlaufe alle Mitglieder der Guild
    for (let member of guild.members.cache.values()) {
      // Wenn das Mitglied ein Bot ist, füge es der Liste hinzu, mit seinem Namen und seinen Details
      if (member.user.bot) {
        allBots[guild.name].push({
          name: member.user.username,
          details: member.user,
        });
      }
    }

    // Sortiere die Liste nach dem Namen der Bots alphabetisch
    allBots[guild.name].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Sende das Objekt als JSON-Antwort
  res.json(allBots);
});

// Exportiere den Router, um ihn in der App zu verwenden
module.exports = router;