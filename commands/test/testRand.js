// imports
const messageTools = require('../../utils/messages/messageTools');
const Discord = require('discord.js');
const scriptHandler = require('../../utils/script/script');
const sharp = require('sharp');
const Canvas = require('canvas');
// exports
module.exports = {
    async execute(testmessage) {
        const messages = await messageTools.messageCollector(testmessage);
        const speakers = await messageTools.speakerParser(messages);
        const script = scriptHandler.makeScript(messages);
        console.log(speakers);
        Canvas.registerFont('./fonts/SegoeUI.ttf', { family: 'Segoe UI' });
        const canvas = Canvas.createCanvas(300, 300);
        const ctx = canvas.getContext('2d');
        const scriptPanel = script[1];
        for (let i = 0; i < 2; i++) {
            const speaker = speakers.get(scriptPanel.entries[i].author);
            try {
                const emotionpreBuffer = await speaker.fursona.getEmotionImageBuffer(scriptPanel.entries[i].emotion);
                const newBuffer = await sharp(emotionpreBuffer).tint(speaker.fursona.colour).toBuffer();
                const fursonaImg = await Canvas.loadImage(newBuffer);
                if (i == 0) {
                    ctx.drawImage(fursonaImg, canvas.width - (150 + 100), canvas.height - 175, 100, 200);
                    ctx.restore();
                    const attachment = new Discord.Attachment(canvas.toBuffer(), 'testPanel.png');
                    testmessage.channel.send(attachment);
                }
                else {
                    // i promise you this is the only way
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(fursonaImg, canvas.width - (150 + 100), canvas.height - 175, 100, 200);
                    ctx.translate(0, 0);
                    ctx.scale(1, 1);
                    ctx.restore();
                    const attachment = new Discord.Attachment(canvas.toBuffer(), 'testPanel.png');
                    testmessage.channel.send(attachment);
                }
            }
            catch (error) {
                console.log(error);
            }

        }
    },
};

module.exports.info = {
    name: 'Test',
    description: 'Test',
    summon: 'Test',
};
module.exports.settings = {
    regexp: /^testrand/mi,
    tag: 'test',
};
