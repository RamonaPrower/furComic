const config = require('../config.json');

// test commands
const testUser = require('./test/testUser');
// dm commands

// public commands

const normalCommands = [];
const testCommands = [testUser];
const dmcommands = [];

// create an array so we can push testing commands in when it's enabled
function commands(_normalCommands, _testCommands) {
    const result = [];
    if (config.dev === true) {
        result.push(..._testCommands);
    }
    result.push(..._normalCommands);
    return result;
}

module.exports.commands = commands(normalCommands, testCommands);
module.exports.dmcommands = dmcommands;