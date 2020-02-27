// imports
const messageTools = require('../../utils/messages/messageTools');
const scriptHandler = require('../../utils/script/script');
const panelGeneration = require('../../utils/panel/panelGeneration');
const comicGen = require('../../utils/comic/comic');
const Discord = require('discord.js');
// exports
module.exports = {
	async execute(message) {
		message.channel.startTyping();

        const messages = await messageTools.messageCollector(message);
		const speakers = await messageTools.speakerParser(messages);
		console.log(speakers);
		const script = scriptHandler.makeScript(messages);
		const panels = await panelGeneration.generatePanels(script, speakers);
		const comic = await comicGen.createComic(panels, speakers);
		const attachment = new Discord.Attachment(comic, 'testcomic.png');
		message.channel.send(attachment);

		message.channel.stopTyping();


	},
};

module.exports.info = {
	name: 'Test',
	description: 'Test',
	summon: 'Test',
};
module.exports.settings = {
	regexp: /^testcomic/mi,
	tag: 'test',
};
