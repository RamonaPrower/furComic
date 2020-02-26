const Canvas = require('canvas');
const common = require('./common');
const sharp = require('sharp');

module.exports = {
  /**
   * A promise resolveable panel maker for 1 speaker
   * @param {Panel} panel
   * @param {Speakers} speakers
   * @returns {Promise}
   */
  promiseCreatePanel(scriptPanel, speakers) {
    return new Promise((res) => {
      scriptPanel = scriptPanel.entries[0];
      Canvas.registerFont('./fonts/SegoeUI.ttf', { family: 'Segoe UI' });
      const { lines, dynamFontSize } = common.newLineCreator(scriptPanel.line, 18, 250);
      const canvas = Canvas.createCanvas(300, 300);
      const ctx = canvas.getContext('2d');
      common.drawBackground(ctx);
      this.drawEmotion(ctx, canvas, speakers, scriptPanel).then(() => {
        common.drawBorder(ctx, canvas);
        this.renderLines(ctx, lines, dynamFontSize);
        res(canvas);
      });
    });
  },
  async drawEmotion(ctx, canvas, speakers, scriptPanel) {
    ctx.save();
    ctx.beginPath();
    common.borderPath(ctx, canvas);
    ctx.closePath();
    ctx.clip();
    const speaker = speakers.get(scriptPanel.author);
    const emotionpreBuffer = await speaker.fursona.getEmotionImageBuffer(scriptPanel.emotion);
    const newBuffer = await sharp(emotionpreBuffer).tint(speaker.fursona.colour).toBuffer();
    const fursonaImg = await Canvas.loadImage(newBuffer);
    ctx.drawImage(fursonaImg, canvas.width - (150 + 50), canvas.height - 175, 100, 200);
    ctx.restore();
  },
  /**
   * Renders the lines onto the canvas
   * @param {ctx} ctx
   * @param {Array} lines the lines to draw onto the canvas
   * @param {Number} fontSize the font size to use
   */
  renderLines(ctx, lines, fontSize) {
    ctx.font = fontSize + 'px "Segoe UI",Arial,sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    for (let i = 0, j = lines.length; i < j; i++) {
      ctx.fillText(lines[i], 150, 10 + fontSize + (fontSize + 6) * i);
    }
  },
};