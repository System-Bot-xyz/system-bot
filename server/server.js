require("dotenv").config();
const { Client, ActivityType, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
const ejs = require("ejs"); // EJS-Modul
const url = require("url"); // URL-Modul
const path = require("path"); // Path-Modul
const axios = require("axios");
const querystring = require("querystring");
const session = require("express-session"); // Session-Modul
const express = require("express");

//API Imports
const apiRouter = require('./api/index');
const usersRouter = require('./api/users');
const botsRouter = require('./api/bots');
const guildsRouter = require('./api/guilds');
//const commandsRouter = require('./api/commands');

const { mongoose, mysql } = require('./database');
const bodyParser = require('./middleware/body-parser');
const cookies = require('./utils/cookies');
const csrf = require('./utils/csrf');

const domain = process.env.DOMAIN;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.CALLBACK_URL;
const scope = process.env.SCOPE;
const port = process.env.PORT;

const app = express();

// Konfiguriere die Express-Middleware
app.use(
  session({
    secret: "Your session secret goes here",
    resave: false,
    saveUninitialized: false,
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(__dirname + '/public'));
app.use(express.json()); // JSON-Parser
app.use(express.urlencoded({ extended: true })); // URL-Parser

app.use('/api', apiRouter);
app.use('/api/users', usersRouter);
app.use('/api/bots', botsRouter);
app.use('/api/guilds', guildsRouter);
//app.use('/api/commands', commandsRouter);

// Send the index.html file when someone visits the index page
app.get("/", (req, res) => {
  res.render('index', { 
    title: process.env.Start_Title,
    header: process.envStart_Header_Title,
    description: process.env.Start_Header_Description,

    footer_socials_link_1: process.env.Footer_Socials_Link_1,
    footer_socials_link_2: process.env.Footer_Socials_Link_2,
    footer_socials_link_3: process.env.Footer_Socials_Link_3,
    footer_socials_link_4: process.env.Footer_Socials_Link_4,
    footer_copyright: process.env.Footer_Copyright_Text,
    footer_created_by: process.env.Footer_Created_By_Text,
    footer_created_by_name: process.env.Footer_Created_By_Text_Name,
    cookiesParser: cookies
  });
});

app.get("/news", (req, res) => {
  res.render('pages/news', { 
    title: process.env.News_Title,

    footer_copyright: process.env.Footer_Copyright_Text,
    footer_created_by: process.env.Footer_Created_By_Text,
    footer_created_by_name: process.env.Footer_Created_By_Text_Name,
    cookiesParser: cookies
  });
});

app.get("/commands", (req, res) => {
  res.render('pages/commands', { 
    title: 'System Bot',

    footer_copyright: process.env.Footer_Copyright_Text,
    footer_created_by: process.env.Footer_Created_By_Text,
    footer_created_by_name: process.env.Footer_Created_By_Text_Name,
    cookiesParser: cookies
  });
});

app.get("/stats", (req, res) => {
  res.render('pages/stats', { 
    title: 'System Bot',

    footer_copyright: process.env.Footer_Copyright_Text,
    footer_created_by: process.env.Footer_Created_By_Text,
    footer_created_by_name: process.env.Footer_Created_By_Text_Name,
    cookiesParser: cookies
  });
});
app.get("/performance", (req, res) => {
  res.render('pages/performance', { 
    title: 'System Bot',

    footer_copyright: process.env.Footer_Copyright_Text,
    footer_created_by: process.env.Footer_Created_By_Text,
    footer_created_by_name: process.env.Footer_Created_By_Text_Name,
    cookiesParser: cookies
  });
});

app.get("/about", (req, res) => {
  res.render('pages/about', { 
    title: 'System Bot',

    footer_copyright: process.env.Footer_Copyright_Text,
    footer_created_by: process.env.Footer_Created_By_Text,
    footer_created_by_name: process.env.Footer_Created_By_Text_Name,
    cookiesParser: cookies
  });
});

app.get("/contact", (req, res) => {
  res.render('pages/contact', { 
    title: 'Contact | System Bot',

    footer_copyright: process.env.Footer_Copyright_Text,
    footer_created_by: process.env.Footer_Created_By_Text,
    footer_created_by_name: process.env.Footer_Created_By_Text_Name,
    cookiesParser: cookies
  });
});

//Auth routes


// Logout-Seite
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/dashboard", (req, res) => {
  res.render('dashboard/index', {
    user: req.user,
    guilds: client.guilds.cache,

    title: 'Dashboard | System Bot',

    footer_copyright: process.env.Footer_Copyright_Text,
    footer_created_by: process.env.Footer_Created_By_Text,
    footer_created_by_name: process.env.Footer_Created_By_Text_Name,
    cookiesParser: cookies
  });
});

app.listen(port, () => {
  console.log(
    `Websocket: The web is connected and run on uri: http://${domain}:${port}!`
  );
});

cookies(app);