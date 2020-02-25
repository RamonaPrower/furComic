const messageLink = require('./messageLink');
const Discord = require('discord.js');
const fursonaTools = require('../fursona/fursona');
const fursonaJSON = require('../../strings/fursona');
const { emotionDecider } = require('../emotions/emotionHandling');

module.exports = {
    /**
     * collects the needed messages from the original message
     * @param {Object} message the message object to parse
     */
    async messageCollector(message) {
        const splitMessage = message.content.split(' ');
        const messageAmount = splitMessage[1];
        const containsLink = messageLink.exists(splitMessage[2]);
        let messages;
        if (messageAmount >= 9 || messageAmount <= 0) {
            console.log('invalid amount');
            return;
        }
        if (containsLink) {
            const foundLink = await messageLink.getLinkObject(splitMessage[2], message.client);
            // if we get a link, we need to fetch the message after it, then perform a search
            // no matter what, we're doing two searches though
            const afterMessage = await foundLink.channel.fetchMessages({ after: foundLink.message.id, limit: 1 });
            messages = await foundLink.channel.fetchMessages({ before: afterMessage.firstKey(), limit: messageAmount });
        }
        else {
            messages = await message.channel.fetchMessages({ before: message.id, limit: messageAmount });
        }
        return messages;
    },
    /**
     * Parses all speakers, and pushes speaker objects and their fursonas to a collection
     * @param {Collection} messages Discord collection of messages
     */
    async speakerParser(messages) {
        const speakers = new Discord.Collection;
        const messageArr = messages.array();
        const colourArr = fursonaJSON.colours;
        for (const message of messageArr) {
            if (!speakers.has(message.author.id)) {
                const randColour = Math.floor(Math.random() * colourArr.length);
                const speaker = {};
                speaker.name = message.author.username;
                speaker.id = message.author.id;
                speaker.avatarUrl = message.author.displayAvatarURL;
                speaker.fursona = await fursonaTools.summonFursona(message.author.id, colourArr[randColour]);
                speakers.set(message.author.id, speaker);
                colourArr.splice(randColour, 1);
            }
        }
        return speakers;
    },
    /**
     * Returns an array with objects containing each message in the script
     * @param {Collection} messages Discord Collection of messages
     */
    scriptParser(messages) {
        // preparing the conversation parser
        const script = new Array;
        // messages come in backwards, we reverse them here
        const reversedArr = messages.array().reverse();
        for (const message of reversedArr) {
            const entry = {};
            entry.message = message.content;
            entry.author = message.author.id;
            entry.emotion = emotionDecider(message.content);
            script.push(entry);
        }
        return script;
    },
};