const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  MessageManager,
  Embed,
  Collection,
  Events,
  ChannelType,
  MessageType,
  Partials,
  NewsChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputStyle,
  ReactionUserManager,
} = require(`discord.js`);
const fs = require("fs");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.Message,
    Partials.GuildMessageReactions,
    Partials.Channel,
    Partials.MessageReactionAdd,
    Partials.MessageReactionRemove,
    Partials.Reaction,
    Partials.VoiceStateUpdate,
    Partials.GuildVoice,
  ],
});
const { createTranscript } = require("discord-html-transcripts");

client.commands = new Collection();
client.prefix = new Map();

require("dotenv").config();

const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
const prefixFolders = fs
  .readdirSync("./src/prefix")
  .filter((f) => f.endsWith(".js"));

for (arx of prefixFolders) {
  const Cmd = require("./prefix/" + arx);
  client.prefix.set(Cmd.name, Cmd);
}

// Moderation Logging System & Anti crash system
const Logs = require('discord-logs');
const process = require("node:process");
const internal = require("stream");

process.on("unhandledRejection", async (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log("Uncaught Exception Monitor", err, origin);
});

Logs(client, {
  debug: true
});

const {handleLogs} = require('./events/handleLogs');

// Async Bot Login
(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleLogs(eventFiles, './events/handleLogs');
  client.handleCommands(commandFolders, "./src/commands");
  client.giveawaysManager(functions, './src/functions/giveawaysManager');
  client.pagination(functions, './src/functions/pagination');
  client.youtubeCheck(functions, './src/functions/youtubeNotification');
  client.login(process.env.TOKEN);
})();

//Join Role
//const joinrole = require('./Schemas.js/joinrole');
//client.on(Events.GuildMemberAdd, async (member, guild) => {

//    const role = await joinrole.findOne({ Guild: member.guild.id });
//    if (!role) return;
//    const giverole = member.guild.roles.cache.get(role.RoleID);
//    member.roles.add(giverole);
//})

//prefix command handler
client.on(Events.MessageCreate, async (message) => {
  const prefix = process.env.PREFIX;

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const prefixcmd = client.prefix.get(command);
  if (prefixcmd) {
    prefixcmd.run(client, message, args);
  }
});

// Snipe
client.snipes = new Map();
client.on(Events.MessageDelete, function(message, channel){
  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author,
    image: message.attachments.first() ? message.attachments.first().proxyURL : null
  });
});

//Link Identifier
client.on(Events.MessageCreate, async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  if (
    message.content.match(/https:\/\/discord\.com\/channels\/\d+\/(\d+)\/(\d+)/)
  ) {
    try {
      const [channelId, messageId] = message.content.match(
        /https:\/\/discord\.com\/channels\/\d+\/(\d+)\/(\d+)/
      );
      const directmessage = await message.channel.messages.fetch(messageId);

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
          name: directmessage.author.username,
          iconURL: directmessage.author.avatarURL(),
        })
        .setDescription(directmessage.content);

      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("View Message")
          .setURL(message.content)
          .setStyle(ButtonStyle.Link)
      );

      await message.reply({ embeds: [embed], components: [button] });
    } catch (e) {
      return console.log(e);
    }
  } else {
    return;
  }
});

//Anti link system
const linkSchema = require("./Schemas/linkSchema");
client.on(Events.MessageCreate, async (message) => {
  if (
    message.content.startsWith("http") ||
    message.content.startsWith("discord.gg") ||
    message.content.includes("discord.gg/") ||
    message.content.includes("https://")
  ) {
    const Data = await linkSchema.findOne({ Guild: message.guild.id });

    if (!Data) return;
    const memberPerms = Data.Perms;
    const user = message.author;
    const member = message.guild.members.cache.get(user.id);
    if (member.permissions.has(memberPerms)) return;
    else {
      (
        await message.channel.send({
          content: `${message.author}, you can't send links here `,
        })
      ).then((msg) => {
        setTimeout(() => msg.delete(), 3000);
      });
      (await message).delete();
    }
  }
});

//Welcome Message System
const welcomeSetupSchema = require("./Schemas/welcomeSchema");
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const guildId = member.guild.id;
    const existingSetup = await welcomeSetupSchema.findOne({ guildId });
    if (!existingSetup) {
      return;
    }
    const channel = member.guild.channels.cache.get(existingSetup.channelId);
    if (!channel) {
      console.error("error", error);
      return;
    }
    let messageContent = existingSetup.welcomeMessage
      .replace("{SERVER_MEMBER}", interaction.guild.memberCount)
      .replace("{USER_MENTION}", `<@${interaction.user.id}>`)
      .replace("{USER_NAME}", interaction.user.username)
      .replace("{SERVER_NAME}", interaction.guild.name);

    if (existingSetup.useEmbed) {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Welcome to the **{SERVER_NAME}** server!")
        .setDescription(messageContent)
        .setThumbnail(userAvatar)
        .setFooter({ text: interaction.guild.name })
        .setTimestamp();

      await channel.send({ content: `<@${member.id}>`, embeds: [embed] });
    } else {
      await channel.send(messageContent);
    }
  } catch (error) {
    console.error("error", error);
  }
});

//Level System
const Level = require("./Schemas/levelSchema");
client.on(Events.MessageCreate, async (message) => {
  try {
    const guildId = message.guild.id;
    const existingLevel = await Level.findOne({ guildId });
    if (!existingLevel) return;

    const userId = message.author.id;

    existingLevel.userXp += 4;
    await existingLevel.save();

    if (existingLevel.userXp >= 100) {
      existingLevel.userXp -= 100;
      existingLevel.userLevel += 1;

      const guild = client.guilds.cache.get(guildId);
      const channel = guild.channels.cache.get(existingLevel.channelId);

      let levelUpMessage =
        existingLevel.messages.length > 0
          ? existingLevel.messages[0].content
              .replace("{userName}", message.author.username)
              .replace("{userMention}", `<@${userId}>`)
              .replace("{userLevel}", existingLevel.userLevel)
          : `Congratulations ${message.author}! You leveled up to level ${existingLevel.userLevel}!`;

      if (existingLevel.useEmbed) {
        const userAvatar = message.author.displayAvatarURL({
          format: "png",
          dynamic: true,
        });
        const serverName = message.guild.name;

        const embed = new EmbedBuilder()
          .setColor("Random")
          .setTitle(serverName)
          .setDescription(levelUpMessage)
          .setThumbnail(userAvatar)
          .setFooter({ text: serverName })
          .setTimestamp();

        channel.send({ embeds: [embed] });
      } else {
        channel.send(levelUpMessage);
      }
    }
    await existingLevel.save();
  } catch (error) {
    console.error("error", error);
  }
});

//Captcha Verification
const { CaptchaGenerator } = require("captcha-canvas");
const captchaSchema = require("./Schemas/captchaSchema");
client.on(Events.GuildMemberAdd, async (member) => {
  const Data = await captchaSchema({ Guild: member.guild.id });
  if (!Data) return;
  else {
    const cap = Data.Captcha;

    const captcha = new CaptchaGenerator()
      .setDimension(150, 450)
      .setCaptcha({ text: `${cap}`, size: 60, color: "green" })
      .setDecoy({ opacity: 0.5 })
      .setTrace({ color: "green" });

    const buffer = captcha.generateSync();

    const attachment = new AttachmentBuilder(buffer, { name: "captcha.png" });

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setImage("attachment://captcha.png")
      .setTimestamp(`Solve the captcha to verify in ${member.guild.name}`)
      .setFooter({
        text: "Use the button below to submit your captcha answer!",
      });

    const capButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("capButton")
        .setLabel("Submit")
        .setStyle(ButtonStyle.Danger)
    );

    const capModal = new ModalBuilder()
      .setTitle("Submit Captcha Answer")
      .setCustomId("capModal");

    const answer = new TextInputBuilder()
      .setCustomId("answer")
      .setRequired(true)
      .setLabel("You captcha answer")
      .setPlaceholder(
        "Submit what you think the captcha is! If you get it wrong you can try again."
      )
      .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(answer);

    capModal.addComponents(firstActionRow);

    const msg = await member
      .send({ embeds: [embed], files: [attachment], components: [capButton] })
      .catch((err) => {
        return;
      });

    const collector = msg.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      if (i.customId === "capButton") {
        i.showModal(capModal);
      }
    });

    guild = member.guild;
  }
});
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  else {
    const guild = interaction.guild;

    if (!interaction.customId === "capModal") return;
    const Data = await captchaSchema.findOne({ Guild: guild.id });

    const answer = interaction.fields.getTextInputValue("answer");
    const cap = Data.Captcha;

    if (answer != `${cap}`)
      return await interaction.reply({
        content: `Thats gonna wrong! Try again.`,
      });
    else {
      const roleID = Data.Role;

      const capGuild = await client.guilds.fetch(guild.id);
      const role = await capGuild.members.fetch(roleID);

      const member = await capGuild.members.fetch(interaction.user.id);

      await member.roles.add(role).catch((err) => {
        interaction.reply({
          content: `There was an error verifying, contact server staff to proceed!`,
        });
      });

      await interaction.reply({
        content: `You have been verified within ${capGuild.name}`,
      });
    }
  }
});

//ModPanel
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.guild) return;

  if (interaction.customId !== "Moderate") return;
  else {
    const string = await interaction.values.toString();

    if (string.includes("ban")) {
      const userId = await interaction.values[0].replace(/ban/g, "");
      const reason = `Moderated by ${interaction.user.id}`;
      const ban = await interaction.guild.bans
        .create(userId, { reason })
        .catch(async (err) => {
          await interaction.reply({ content: `I couldn't ban that user!` });
        });

      if (ban) await interaction.reply({ content: `I have banned ${userId}!` });
    }

    if (string.includes("kick")) {
      const userId = await interaction.values[0].replace(/kick/g, "");
      const member = await interaction.guild.members.fetch(userId);
      const kick = await member
        .kick({ reason: `Moderated by ${interaction.user.id}` })
        .catch(async (err) => {
          await interaction.reply({ content: `I couldn't kick that user!` });
        });

      if (kick)
        await interaction.reply({ content: `I have kicked ${userId}!` });
    }

    if (string.includes("timeout")) {
      const userId = await interaction.values[0].replace(/timeout/g, "");
      const member = await interaction.guild.members.fetch(userId);
      const timeout = await member
        .timeout({ reason: `Moderated by ${interaction.user.id}` })
        .catch(async (err) => {
          await interaction.reply({
            content: `I couldn't time out that user!`,
          });
        });

      if (timeout)
        await interaction.reply({ content: `I have time out ${userId}!` });
    }
  }
});

// Blacklist Server System
const blacklistserverSchema = require('./Schemas/blacklistserverSchema');
client.on(Events.GuildCreate, async guild => {
  const data = await blacklistserverSchema.findOne({ Guild: guild.id });
  
  if(!data) return;
  else {
    await guild.leave();
  }
});

// Ticket System
const ticketSchema = require("./Schemas/ticketSchema");
client.on(Events.InteractionCreate, async (interaction) => {
  const { customId, guild, channel } = interaction;
  if (interaction.isButton()) {
    if (customId === "General") {
      let data = await ticketSchema.findOne({
        GuildID: interaction.guild.id,
      });

      if (!data)
        return await interaction.reply({
          content: "You have not setup a ticket system.",
          ephemeral: true,
        });

      const role = guild.roles.cache.get(data.Role);
      const cate = data.Category;
      const posChannel = interaction.guild.channels.cache.find(
        (c) =>
          c.topic &&
          c.topic.includes(
            `Ticket Informationen\n\nThema: ${customId}\nUsername: ${interaction.user.username} ID: ${interaction.user.id}`
          )
      );
      if (posChannel) {
        return await interaction.reply({
          content: `You already have a ticket open: <#${posChannel.id}>`,
          ephemeral: true,
        });
      }

      await interaction.guild.channels
        .create({
          name: `ticket-${customId}-${interaction.user.username}`,
          parent: cate,
          type: ChannelType.GuildText,
          topic: `Ticket Informationen\n\nThema: ${customId}\nUsername: ${interaction.user.username} ID: ${interaction.user.id}`,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: ["ViewChannel"],
            },
            {
              id: role.id,
              allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
            },
            {
              id: interaction.member.id,
              allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
            },
          ],
        })
        .then(async (channel) => {
          const openembed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Ticket Geöffnet")
            .setDescription(
              `Willkommen zu deinem Ticket **${interaction.user.username}** \n\nThema: ${customId}\nUser: ${interaction.user.username}\nUser ID: ${interaction.user.id}\n\nReact with 🔒 to close the ticket.\n`
            )
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}'s Tickets` });

          const closeButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("closeticket")
              .setLabel("Schließen")
              .setStyle(ButtonStyle.Danger)
              .setEmoji("🔒")
          );
          await channel.send({
            content: `<@&${role.id}>`,
            embeds: [openembed],
            components: [closeButton],
          });

          const openTicket = new EmbedBuilder().setDescription(
            `Your ticket has been opened in **<#${channel.id}>** with the topic: **${customId}**.`
          );

          await interaction.reply({ embeds: [openTicket], ephemeral: true });
        });
    }

    if (customId === "How to use") {
      let data = await ticketSchema.findOne({
        GuildID: interaction.guild.id,
      });

      if (!data)
        return await interaction.reply({
          content: "You have not setup a ticket system.",
          ephemeral: true,
        });

      const role = guild.roles.cache.get(data.Role);
      const cate = data.Category;
      const posChannel = interaction.guild.channels.cache.find(
        (c) =>
          c.topic &&
          c.topic.includes(
            `Ticket Informationen\n\nThema: ${customId}\nUsername: ${interaction.user.username} ID: ${interaction.user.id}`
          )
      );

      if (posChannel) {
        return await interaction.reply({
          content: `You already have a ticket open: <#${posChannel.id}>`,
          ephemeral: true,
        });
      }

      await interaction.guild.channels
        .create({
          name: `ticket-${customId}-${interaction.user.username}`,
          parent: cate,
          type: ChannelType.GuildText,
          topic: `Ticket Informationen\n\nThema: ${customId}\nUsername: ${interaction.user.username} ID: ${interaction.user.id}`,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: ["ViewChannel"],
            },
            {
              id: role.id,
              allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
            },
            {
              id: interaction.member.id,
              allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
            },
          ],
        })
        .then(async (channel) => {
          const openembed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Ticket Geöffnet")
            .setDescription(
              `Willkommen zu deinem Ticket **${interaction.user.username}** \n\nThema: ${customId}\nUser: ${interaction.user.username}\nUser ID: ${interaction.user.id}\n\nReact with 🔒 to close the ticket.\n`
            )
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}'s Tickets` });

          const closeButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("closeticket")
              .setLabel("Schließen")
              .setStyle(ButtonStyle.Danger)
              .setEmoji("🔒")
          );
          await channel.send({
            content: `<@&${role.id}>`,
            embeds: [openembed],
            components: [closeButton],
          });

          const openTicket = new EmbedBuilder().setDescription(
            `Your ticket has been opened in **<#${channel.id}>** with the topic: **${customId}**.`
          );

          await interaction.reply({ embeds: [openTicket], ephemeral: true });
        });
    }

    if (customId === "closeticket") {
      const closingEmbed = new EmbedBuilder()
        .setDescription("🔒 are you sure you want to close this ticket?")
        .setColor("Random");

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("yesclose")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🔐"),

        new ButtonBuilder()
          .setCustomId("noclose")
          .setLabel("No")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("❌")
      );
      await interaction.reply({
        embeds: [closingEmbed],
        components: [buttons],
      });
    }

    if (customId === "yesclose") {
      let data = await ticketSchema.findOne({ GuildID: interaction.guild.id });
      const transcript = await createTranscript(channel, {
        limit: -1,
        returnBuffer: false,
        filename: `ticket-${interaction.user.username}.html`,
      });

      const transcriptEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.guild.name}'s Transcripts`,
          iconURL: guild.iconURL(),
        })
        .addFields(
          { name: "Username", value: `${interaction.user.username}` },
          { name: "Geschlossen", value: `${interaction.user.tag}` }
        )
        .setColor("Random")
        .setTimestamp()
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ text: `${interaction.guild.name}'s Tickets` });

      const processEmbed = new EmbedBuilder()
        .setDescription(`Closing ticket in 10 seconds...`)
        .setColor("Random");

      await interaction.reply({ embeds: [processEmbed] });

      await guild.channels.cache.get(data.Logs).send({
        embeds: [transcriptEmbed],
        files: [transcript],
      });

      setTimeout(() => {
        interaction.channel.delete();
      }, 10000);
    }

    if (customId === "noclose") {
      const noEmbed = new EmbedBuilder()
        .setDescription("Ticket close cancelled.")
        .setColor("Random");

      await interaction.reply({ embeds: [noEmbed], ephemeral: true });
    }
  }
});

// bug-report
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "Bug Report") {
    const command =
      interaction.fields.getTextInputValue("command") || "No server provided.";
    const description =
      interaction.fields.getTextInputValue("description") ||
      "No server provided.";
    const member = interaction.member || "No server provided.";
    const id = interaction.user.id || "No server provided.";
    const serverId = interaction.guild.id || "No server provided.";
    const servername = interaction.guild.name || "No server provided.";
    const customId = interaction.customId || "No server provided.";
    const channel = await client.channels.cache.get(process.env.DEV_BUG_REPORT);

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`Bug Report from ${interaction.user.displayName}!`)
      .addFields({ name: "Thema", value: `${customId}` })
      .addFields({
        name: "Displayname / ID",
        value: `${interaction.user.displayName} ||${id}||`,
      })
      .addFields({
        name: "Server Name / ID",
        value: `${servername} ||${serverId}||`,
      })
      .addFields({ name: "Command", value: `${command}` })
      .addFields({ name: "Description", value: `${description}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] }).catch((err) => {});
    await interaction.reply({
      content: `Your report has been submitted.`,
      ephemeral: true,
    });
  }
});

// player-report
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "Player Report") {
    const playername =
      interaction.fields.getTextInputValue("playername") ||
      "No server provided.";
    const reportreason =
      interaction.fields.getTextInputValue("reportreason") ||
      "No server provided.";
    const member = interaction.member || "No server provided.";
    const id = interaction.user.id || "No server provided.";
    const serverId = interaction.guild.id || "No server provided.";
    const servername = interaction.guild.name || "No server provided.";
    const customId = interaction.customId || "No server provided.";
    const channel = await client.channels.cache.get(process.env.DEV_BUG_REPORT);

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`Player Report from ${interaction.user.username}!`)
      .addFields({ name: "Thema", value: `${customId}` })
      .addFields({
        name: "Displayname / Tagged Name / Username / ID",
        value: `${interaction.user.displayName} / ${member} / ${interaction.user.username} / ||${id}||`,
      })
      .addFields({
        name: "Server Name / ID",
        value: `${servername} ||${serverId}||`,
      })
      .addFields({ name: "Spieler", value: `${playername}` })
      .addFields({ name: "Grund", value: `${reportreason}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] }).catch((err) => {});
    await interaction.reply({
      content: `Your report has been submitted.`,
      ephemeral: true,
    });
  }
});

// Sticky Message
const stickySchema = require("./Schemas/stickySchema");
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  stickySchema.findOne({ ChannelID: message.channel.id }, async (err, data) => {
    if (err) throw err;
    if (!data) {
      return;
    }

    let channel = data.ChannelID;
    let cachedChannel = client.channels.cache.get(channel);

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(data.Message)
      .setFooter({ text: "This is a sticky message" });

    if (message.channel.id == channel) {
      data.CurrentCount += 1;
      data.save();

      if (data.CurrentCount > data.MaxCount) {
        try {
          await client.channels.cache
            .get(channel)
            .messages.fetch(data.LastMessageID)
            .then(async (m) => {
              await m.delete();
            });

          let newMessage = await cachedChannel.send({ embeds: [embed] });

          data.LastMessageID = newMessage.id;
          data.CurrentCount = 0;
          data.save();
        } catch {
          return;
        }
      }
    }
  });
});

//Chat Logic
const axios = require("axios");
client.on(Events.MessageCreate, async (message) => {
  if (message.channel.type === ChannelType.DM) {
    if (message.author.bot) return;

    await message.channel.sendTyping();

    let input = {
      method: "GET",
      url: `https://google-bard1.p.rapidapi.com/`,
      headers: {
        text: message.content,
        "X-RapidAPI-Key": process.env.GOOGLEBARD_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "google-bard1.p.rapidapi.com",
      },
    };

    try {
      const output = await axios.request(input);
      const response = output.data.response;

      if (response.length > 2000) {
        const chunks = response.match(/.{1,2000}/g);

        for (let i = 0; i < chunks.length; i++) {
          await message.author.send(chunks[i]).catch((err) => {
            message.author
              .send(
                `I am having a hard time finding that request! Because i am an AI on discord, i don't have time to process long requests.`
              )
              .catch((err) => {});
          });
        }
      } else {
        await message.author.send(response).catch((err) => {
          message.author
            .send(
              `I am having a hard time finding that request! Because i am an AI on discord, i don't have time to process long requests.`
            )
            .catch((err) => {});
        });
      }
    } catch (e) {
      console.log(e);
      message.author
        .send(
          `I am having a hard time finding that request! Because i am an AI on discord, i don't have time to process long requests.`
        )
        .catch((err) => {});
    }
  } else {
    return;
  }
});

// auto publish system
const autopublishSchema = require('./Schemas/autopublishSchema');
client.on(Events.MessageCreate, async message => {
  if(message.channel.type !== ChannelType.GuildAnnouncement) return;
  if(message.author.bot) return;
  if(message.content.startsWith('.')) return;
  else {
    const autopublish = await autopublishSchema.findOne({ Guild: message.guild.id });
    if(!autopublish) return;
    if(!autopublish.Channel.includes(message.channel.id)) return;

    try {
      message.crosspost();
    } catch (e) {
      return;
    }
  }
});

// Ghost Ping System
const ghostpingSchema = require('./Schemas/ghostpingSchema');
const ghostnumSchema = require('./Schemas/ghostnumSchema');
client.on(Events.MessageDelete, async message => {
  const ghostping = await ghostpingSchema.findOne({ Guild: message.guild.id });
  if(!ghostping) return;
  if(message.author.bot) return;
  if(!message.author.id === client.user.id) return;
  if(message.author === message.mentions.users.first()) return;

  if(message.mentions.users.first() || message.type === MessageType.reply){
    let number;
    let time = 15;

    const ghostnum = await ghostnumSchema.findOne({ Guild: message.guild.id, User: message.author.id });
    if(!ghostnum){
      await ghostnumSchema.create({
        Guild: message.guild.id,
        User: message.author.id,
        Number: 1
      });
      number = 1;
    } else {
      ghostnum.Number += 1;
      await ghostnum.save();
      number = ghostnum.Number;
    }

    if(number == 2) time = 60;
    if(number >= 3) time = 300;

    const ghostmsg = await message.channel.send({ content: `${message.author}, you cannot ghost ping members within this server!` });
    setTimeout(() => ghostmsg.delete(), 5000);

    const member = message.member;

    if(message.member.permissions.has(PermissionsBitField.Flags.Administrator)){
      return;
    } else {
      await member.timeout(time * 1000, 'Ghost pinging')
      await member.send({ content: `You have been timed out in ${message.guild.name} for ${time} seconds due to ghost pinging members.` }).catch(err => {
        return;
      });
    }
  }
});

// Invite Logger System
const inviteSchema = require('./Schemas/inviteSchema');
const invites = new Collection()
const wait = require('timers/promises').setTimeout;
client.on('ready', async () =>{
  await wait(2000);
  client.guilds.cache.forEach(async (guild) => {
    const clientMember = guild.members.cache.get(client.user.id);
    if(!clientMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;
    const firstInvites = await guild.invites.fetch().catch(err => {console.log(err)})
    invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
  })
});
client.on(Events.GuildMemberAdd, async member => {
  const invitelogger = await inviteSchema.findOne({ Guild: member.guild.id });
  if(!invitelogger) return;
  const channelID = invitelogger.Channel;
  const channel = await member.guild.channels.cache.get(channelID);
  const newInvites = await member.guild.invites.fetch();
  const oldInvites = invites.get(member.guild.id);
  const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
  const inviter = await client.users.fetch(invite.inviter.id);

  inviter
    ? channel.send(`${member.user.tag} joined the server using the invite ${invite.code} from ${inviter.tag}. The invite was used ${invite.uses} times since its creation.`)
    : channel.send(`${member.user.tag} joined the server but i cant find what invite they used to do it.`)
});

// Join To Create System
const joinschema = require('./Schemas/jointocreateSchema');
const joinchannelschema = require('./Schemas/jointocreatechannelsSchema');
client.on(Events.VoiceStateUpdate, async(oldState, newState) => {
  try {
    if(newState.member.guild === null) return;
  } catch (err) {
    return;
  }

  const joindata = await joinschema.findOne({ Guild: newState.guild.id });
  const joinchanneldata = await joinchannelschema.findOne({ Guild: newState.member.guild.id, User: newState.member.id });

  const voicechannel = newState.channel;

  if(!joindata) return;

  if(!voicechannel) return;
  else {
    if(voicechannel.id === joindata.Channel){
      if(joinchanneldata){
        try {
          return await newState.member.send({ content: `You already have a voice channel open right now!` });
        } catch (err) {
          return;
        }
      } else {
        try {
          const channel = await newState.member.guild.channels.create({
            type: ChannelType.GuildVoice,
            name: `${newState.member.user.username}-room`,
            userLimit: joindata.VoiceLimit,
            parent: joindata.Category
          });
  
          try {
            await newState.member.voice.setChannel(channel.id);
          } catch (err) {
            return;
          }
  
          setTimeout(() => {
            joinchannelschema.create({
              Guild: newState.member.guild.id,
              Channel: channel.id,
              User: newState.member.id
            }, 500)
          });
        } catch (err) {
          try {
            await newState.member.send({ content: `I could not create your channel, i may be missing permissions.` });
          } catch (err) {
            return;
          }
  
          return;
        }
  
        try {
          const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: `Join To Create System` })
            .setTitle('> Channel Created')
            .addFields({ name: 'Channel Created', value: `> Your voice channel has been\n>created in **${newState.member.guild.name}**.`})
            .setFooter({ text: `Channel Created` })
            .setTimestamp();
  
          await newState.member.send({ embeds: [embed] });
        } catch (err) {
          return;
        }
      }
    }
  }
});
client.on(Events.VoiceStateUpdate, async(oldState, newState) => {
  try {
    if(oldState.member.guild === null) return;
  } catch (err) {
    return;
  }

  const leavechanneldata = await joinchannelschema.findOne({ Guild: oldState.member.guild.id, User: oldState.member.id });
  if(!leavechanneldata) return;
  else {
    const voicechannel = await oldState.member.guild.channels.cache.get(leavechanneldata.Channel);

    try {
      await voicechannel.delete();
    } catch (err) {
      return;
    }

    await joinchannelschema.deleteMany({ Guild: oldState.guild.id, User: oldState.member.id });
    try {
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTimestamp()
        .setAuthor({ name: `Join To Create System` })
        .setFooter({ text: `Channel Delete` })
        .setTitle('> Channel Delete')
        .addFields({ name: 'Channel Deleted', value: `> Your voice channel has been\n>deleted in **${newState.member.guild.name}**.` });

      await newState.member.send({ embeds: [embed] });
    } catch (err) {
      return;
    }
  }
});

//counting system
const counting = require('./Schemas/countingSchema');
client.on(Events.MessageCreate, async message => {
  if(!message.guild) return;
  if(message.author.bot) return;

  const countingdata = await counting.findOne({ Guild: message.guild.id });
  if(!countingdata) return;
  else {
    if(message.channel.id !== countingdata.Channel) return;
    const number = Number(message.content);

    if(number !== data.Number){
      return message.react('❌');
    } else if(countingdata.LastUser === message.author.id){
      message.react('❌');
      const msg = await message.reply(`❌ Someone else has to count that number!`);

      setTimeout(async() => {
        await msg.delete();
      }, 5000);
    } else {
      await message.react('☑️');

      countingdata.LastUser = message.author.id;
      countingdata.Number++;
      await countingdata.save();
    }
  }
});

// Giveaway System
const GiveawaysManager = require('./functions/giveawaysManager');
client.giveawayManager = new GiveawaysManager(client, {
  default: {
    botsCanWin: false,
    embedColor: `Random`,
    embedColorEnd: 'Random',
    reaction: '🎉',
  },
});

// Join Role System
const joinroleSchema = require('./Schemas/joinroleSchema');
client.on(Events.GuildMemberAdd, async(member, guild) => {
  const role = await joinroleSchema.findOne({ Guild: member.guild.id });
  if(!role) return;
  const giverole = member.guild.roles.cache.get(role.RoleID);
  member.roles.add(giverole);
});