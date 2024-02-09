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
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputStyle
} = require(`discord.js`);
const fs = require("fs");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
const { createTranscript } = require("discord-html-transcripts");
require("../server/server");

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

// Anti crash system
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

// Async Bot Login
(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
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

client.on(Events.MessageCreate, async(message) => {
  //prefix command handler
  const prefix = process.env.PREFIX;

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const prefixcmd = client.prefix.get(command);
  if (prefixcmd) {
      prefixcmd.run(client, message, args)
  }
});

//Anti link system
const linkSchema = require("./Schemas/linkSchema.js");
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
client.on(Events.GuildMemberAdd, async member => {
  try {
    const guildId = member.guild.id;
    const existingSetup = await welcomeSetupSchema.findOne({ guildId });
    if(!existingSetup){
      return;
    }
    const channel = member.guild.channels.cache.get(existingSetup.channelId);
    if(!channel){
      console.error('error', error);
      return;
    }
    let messageContent = existingSetup.welcomeMessage
      .replace('{SERVER_MEMBER}', interaction.guild.memberCount)
      .replace('{USER_MENTION}', `<@${interaction.user.id}>`)
      .replace('{USER_NAME}', interaction.user.username)
      .replace('{SERVER_NAME}', interaction.guild.name);

    if(existingSetup.useEmbed){
      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle('Welcome to the **{SERVER_NAME}** server!')
        .setDescription(messageContent)
        .setThumbnail(userAvatar)
        .setFooter({ text: interaction.guild.name })
        .setTimestamp();

      await channel.send({ content: `<@${member.id}>`, embeds: [embed] });
    } else {
      await channel.send(messageContent);
    }
  } catch (error) {
    console.error('error', error);
  }
});

//Level System
const Level = require("./Schemas/levelSchema");
client.on(Events.MessageCreate, async message => {
  try {
    const guildId = message.guild.id;
    const existingLevel = await Level.findOne({ guildId });
    if(!existingLevel) return;

    const userId = message.author.id;

    existingLevel.userXp += 4;
    await existingLevel.save();

    if(existingLevel.userXp >= 100){
      existingLevel.userXp -= 100;
      existingLevel.userLevel += 1;

      const guild = client.guilds.cache.get(guildId);
      const channel = guild.channels.cache.get(existingLevel.channelId);

      let levelUpMessage = existingLevel.messages.length > 0 ? existingLevel.messages[0].content
        .replace('{userName}', message.author.username)
        .replace('{userMention}', `<@${userId}>`) 
        .replace('{userLevel}', existingLevel.userLevel) : `Congratulations ${message.author}! You leveled up to level ${existingLevel.userLevel}!`;
        
      if(existingLevel.useEmbed){
        const userAvatar = message.author.displayAvatarURL({ format: 'png', dynamic: true });
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
    console.error('error', error);
  }
});

//Captcha Verification
const { CaptchaGenerator } = require('captcha-canvas');
const captchaSchema = require('./Schemas/captchaSchema');
client.on(Events.GuildMemberAdd, async member => {
  const Data = await captchaSchema({ Guild: member.guild.id });
  if(!Data) return;
  else {
    const cap = Data.Captcha;

    const captcha = new CaptchaGenerator()
      .setDimension(150, 450)
      .setCaptcha({ text: `${cap}`, size: 60, color: 'green' })
      .setDecoy({ opacity: 0.5 })
      .setTrace({ color: 'green' })

    const buffer = captcha.generateSync();

    const attachment = new AttachmentBuilder(buffer, { name: 'captcha.png' });

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setImage('attachment://captcha.png')
      .setTimestamp(`Solve the captcha to verify in ${member.guild.name}`)
      .setFooter({ text: 'Use the button below to submit your captcha answer!' })

    const capButton = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('capButton')
      .setLabel('Submit')
      .setStyle(ButtonStyle.Danger)
    )

    const capModal = new ModalBuilder()
      .setTitle('Submit Captcha Answer')
      .setCustomId('capModal')

    const answer = new TextInputBuilder()
      .setCustomId('answer')
      .setRequired(true)
      .setLabel('You captcha answer')
      .setPlaceholder('Submit what you think the captcha is! If you get it wrong you can try again.')
      .setStyle(TextInputStyle.Short)

    const firstActionRow = new ActionRowBuilder().addComponents(answer);

    capModal.addComponents(firstActionRow);

    const msg = await member.send({ embeds: [embed], files: [attachment], components: [capButton] }).catch(err => {
      return;
    });

    const collector = msg.createMessageComponentCollector()

    collector.on('collect', async i => {
      if(i.customId === 'capButton'){
        i.showModal(capModal);
      }
    });

    guild=member.guild;
  }
});
client.on(Events.InteractionCreate, async interaction => {
  if(!interaction.isModalSubmit()) return;
  else {
    if(!interaction.customId === 'capModal') return;
    const Data = await captchaSchema.findOne({ Guild: guild.id });

    const answer = interaction.fields.getTextInputValue('answer');
    const cap = Data.Captcha;

    if(answer != `${cap}`) return await interaction.reply({ content: `Thats gonna wrong! Try again.`, });
    else {
      const roleID = Data.Role;

      const capGuild = await client.guilds.fetch(guild.id);
      const role = await capGuild.members.fetch(roleID);

      const member = await capGuild.members.fetch(interaction.user.id);

      await member.roles.add(role).catch(err => {
        interaction.reply({ content: `There was an error verifying, contact server staff to proceed!` });
      });

      await interaction.reply({ content: `You have been verified within ${capGuild.name}` });
    }
  }
});

// Ticket System
const ticketSchema = require("./Schemas/ticketSchema.js");
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
          name: `ticket-${interaction.user.username}`,
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
          name: `ticket-${interaction.user.username}`,
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
        name: "Displayname / Tagged Name / Username / ID",
        value: `${interaction.user.displayName} / ${member} / ${interaction.user.username} / ||${id}||`,
      })
      .addFields({
        name: "Server Name / ID",
        value: `${servername} ||${serverId}||`,
      })
      .addFields({ name: "Command", value: `${command}` })
      .addFields({ name: "Description", value: `${description}` })
      .setTimestamp()
      .setFooter({
        text: `• Bug Report System • 2022-2023 © PlayGS Netzwerk | Alle rechte vorbehalten.`,
      });

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
      .setTimestamp()
      .setFooter({
        text: `• Player Report System • 2022-2023 © PlayGS Netzwerk | Alle rechte vorbehalten.`,
      });

    await channel.send({ embeds: [embed] }).catch((err) => {});
    await interaction.reply({
      content: `Your report has been submitted.`,
      ephemeral: true,
    });
  }
});
