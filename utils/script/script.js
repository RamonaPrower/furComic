const messageTools = require('../messages/messageTools');

module.exports = {
    makeScript(messages) {
        const panels = [];
        const lineScript = messageTools.scriptParser(messages);
        for (let i = 0; i < lineScript.length; i++) {
            const panel = {};
            const entries = [];
            const entry = {};
            panel.speakers = 1;
            entry.line = lineScript[i].message;
            entry.author = lineScript[i].author;
            entry.emotion = lineScript[i].emotion;
            entries.push(entry);
            if (lineScript.length != i && lineScript.length > 1) {
                if (lineScript[i].author != lineScript[i + 1].author && lineScript[i].message.length <= 40) {
                    const bonusEntry = {};
                    panel.speakers = 2;
                    bonusEntry.line = lineScript[i + 1].message;
                    bonusEntry.author = lineScript[i + 1].author;
                    bonusEntry.emotion = lineScript[i + 1].emotion;
                    entries.push(bonusEntry);
                    i++;
                }
            }
            panel.entries = entries;
            panels.push(panel);
        }
        return panels;
    },
};