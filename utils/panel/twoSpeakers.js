const Canvas = require('canvas');
const common = require('./common');

module.exports = {
    /**
     * A promise resolveable panel maker for 2 speakers
     * @param {Panel} panel
     * @param {Speakers} speakers
     * @returns {Promise}
     */
    promiseCreatePanel(scriptPanel, speakers) {
        return new Promise((res) => {

            Canvas.registerFont('./fonts/SegoeUI.ttf', { family: 'Segoe UI' });
            const canvas = Canvas.createCanvas(300, 300);
            const ctx = canvas.getContext('2d');
            common.drawBackground(ctx);
            common.drawFrontBackground(ctx, canvas);
            common.drawBorder(ctx, canvas);
            this.drawEmotions(ctx, canvas, speakers, scriptPanel).then(() => {
                let lastLineCount = 0;
                for (let i = 0; i < 2; i++) {
                    const { lines, dynamFontSize } = common.newLineCreator(scriptPanel.entries[i].line, 14, 190);
                    this.renderLines(ctx, lines, dynamFontSize, i, lastLineCount);
                    lastLineCount = lines.length;
                }
                res(canvas);
            });
        });
    },
    async drawEmotions(ctx, canvas, speakers, scriptPanel) {
        for (let i = 0; i < 2; i++) {
            ctx.save();
            ctx.beginPath();
            common.borderPath(ctx, canvas);
            ctx.closePath();
            ctx.clip();
            const speaker = speakers.get(scriptPanel.entries[i].author);
            try {
                const emotionpreBuffer = await speaker.fursona.getEmotionImageBuffer(scriptPanel.entries[i].emotion);
                const fursonaImg = await Canvas.loadImage(emotionpreBuffer);
                if (i == 0) {
                    ctx.drawImage(fursonaImg, canvas.width - (150 + 100), canvas.height - 175, 100, 200);
                    ctx.restore();
                }
                else {
                    // i promise you this is the only way
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(fursonaImg, canvas.width - (150 + 100), canvas.height - 175, 100, 200);
                    ctx.translate(0, 0);
                    ctx.scale(1, 1);
                    ctx.restore();
                }
            }
            catch (error) {
                console.log(error);
            }

        }
    },
    /**
     * Renders the lines onto the canvas
     * @param {ctx} ctx
     * @param {Array} lines the lines to draw onto the canvas
     * @param {Number} fontSize the font size to use
     */
    renderLines(ctx, lines, fontSize, hostI, ogLineCount) {
        ctx.font = fontSize + 'px "Segoe UI",Arial,sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        const x = 100 + (100 * hostI);
        for (let i = 0, j = lines.length; i < j; i++) {
            const y = (10 + fontSize + (fontSize + 6) * i);
            ctx.fillText(lines[i], x, y + (((fontSize + 6) * ogLineCount) * hostI));
        }
    },
};