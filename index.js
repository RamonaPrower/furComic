// imports
const Discord = require('discord.js');
const config = require('./config.json');
const mongoose = require('mongoose');
const commandList = require('./commands/command');

// start of the generation of command imports
const client = new Discord.Client;
// normal commands
client.commands = new Discord.Collection();
const commandsComms = commandList.commands;
for (const file of commandsComms) {
    client.commands.set(file.settings.regexp, file);
}
// DM only commands

// Start of Message Loops

client.on('message', message => {
    const mentioned = message.isMentioned(client.user);
    if (message.author.bot) return;

    if (mentioned === true || config.dev === true) {
        for (const [key, value] of client.commands) {
            const newReg = key;
            if (newReg.test(message.content)) {
                value.execute(message);
                break;
            }
        }
    }
});

// everything after this point doesn't need to be touched
// reconnection and error handling

client.on('ready', () => {
    console.log(`I'm up, and i'm part of ${client.guilds.size} servers`);
    const db = config.db;
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('connected Succesfully to Database');
        })
        .catch(console.error);
});

client.login(config.discord)
    .then(console.log('Logging In'))
    .catch(console.error);

client.on('error', data => {
    console.error('Connection Error', data.message);
});

client.on('disconnect', data => {
    console.error('I have Disconnected', data.message);
    autoRestartServer();
});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

function autoRestartServer() {
    setTimeout(() => {
        if (!client.status == 0) process.exit(1);
    }, 1500);
}