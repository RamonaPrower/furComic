// imports
const messageTools = require('../../utils/messages/messageTools');
// exports
module.exports = {
	async execute(message) {
        console.log();
        const messages = await messageTools.messageCollector(message);
        const speakers = await messageTools.speakerParser(messages);
        console.log(speakers);
	},
};

module.exports.info = {
	name: 'Test',
	description: 'Test',
	summon: 'Test',
};
module.exports.settings = {
	regexp: /^testmessages/mi,
	tag: 'test',
};
