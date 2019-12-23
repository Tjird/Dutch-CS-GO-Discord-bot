const Steam = require('steam');
const steamClient = new Steam.SteamClient();
const steamUser = new Steam.SteamUser(steamClient);
const steamFriends = new Steam.SteamFriends(steamClient);
const steamGC = new Steam.SteamGameCoordinator(steamClient, 730);
const csgo = require('csgo');
const CSGO = new csgo.CSGOClient(steamUser, steamGC, false);
const Discord = require("discord.js");
const discord = new Discord.Client();
const Enmap = require("enmap");
const fs = require("fs");
require('dotenv').config();

steamClient.on('connected', () => {
    steamUser.logOn({
        account_name: process.env.STEAM_USERNAME,
        password: process.env.STEAM_PASSWORD
    });
});

steamClient.on('logOnResponse', () => {
    console.log("Steam is ready.")

    CSGO.on("ready", () => {
        console.log("CSGO is ready.");

        discord.prefix = "!";

        fs.readdir("./events/", (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                const event = require(`./events/${file}`);
                let eventName = file.split(".")[0];
                discord.on(eventName, event.bind(null, discord, CSGO, steamFriends));
            });
        });

        discord.commands = new Enmap();

        fs.readdir("./commands/", (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith(".js")) return;
                let props = require(`./commands/${file}`);
                let commandName = file.split(".")[0];
                console.log(`Attempting to load command ${commandName}.`);
                discord.commands.set(commandName, props);
            });
        });

        discord.login(process.env.DISCORD_TOKEN);
    });

    CSGO.launch();
});

steamClient.connect();