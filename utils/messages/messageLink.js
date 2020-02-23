module.exports = {
    /**
     * A tester to see if a validly formatted discord link exists
     * @param {String} link the string to check for a valid discord link
     */
    exists(link) {
        const linkRegexp = /(https:\/\/(.*\.+|)discordapp.com\/channels\/(\d+)\/(\d+)\/(\d+))/mi;
        const result = linkRegexp.test(link);
        return result;
    },
    /**
     * Gets the Guild, channel and message of the link in question
     * @param {String} link the link to summon details of
     * @param {Discord.Client} client A discord client object
     * @returns {Object} an object with the Guild, Channel and message, and if it has failed or not
     */
    async getLinkObject(link, client) {
        const splitStr = link.match(/\d+/gmi);
        const obj = {};
        const foundGuild = client.guilds.get(splitStr[0]);
        if (!foundGuild) {
            obj.found = false;
            obj.reason = 'Couldn\'t find the server this message was in';
            return obj;
        }
        obj.guild = foundGuild;
        const foundChannel = obj.guild.channels.get(splitStr[1]);
        if (!foundChannel) {
            obj.found = false;
            obj.reason = 'Couldn\'t find the Channel this message was in';
            return obj;
        }
        obj.channel = foundChannel;
        let foundMessage;
        try {
            foundMessage = await obj.channel.fetchMessage(splitStr[2]);
        }
        catch (error) {
            obj.found = false;
            obj.reason = 'Couldn\'t find the message';
            return obj;
        }
        obj.found = true;
        obj.message = foundMessage;
        return obj;
    },
};