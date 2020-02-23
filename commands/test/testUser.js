// imports

const fursonaTools = require('../../utils/fursona/fursona');

// exports
module.exports = {
	async execute(message) {
        const fursona = await fursonaTools.createFursona(message.author.id);
        console.log(fursona);
	},
};

module.exports.info = {
	name: 'Test',
	description: 'Test',
	summon: 'Test',
};
module.exports.settings = {
	regexp: /^testuser/mi,
	tag: 'test',
};
