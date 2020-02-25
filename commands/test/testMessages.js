// imports
const messageTools = require('../../utils/messages/messageTools');
const script = require('../../utils/script/script');
// exports
module.exports = {
	async execute(message) {
        console.log();
        const messages = await messageTools.messageCollector(message);
		const speakers = await messageTools.speakerParser(messages);
		const genScript = script.makeScript(messages);
        console.log(genScript);
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
