const Canvas = require('canvas');

module.exports = {
      /**
* Splits a single line into max width text, with 25px padding on each side
* @param {String} text the input text to push to multiple lines
* @param {Number} fontSize The intended Font size, this will scale down if needed
* @returns {Array, Number} An array containing each line, and the font size to use
*/
  newLineCreator(text, fontSize, maxWidth) {
    // set up the variables we'll need for calculation
    const canvas = Canvas.createCanvas(300, 300);
    const ctx = canvas.getContext('2d');
    let lines = [];
    let result;
    let tokens = text.split(/\r\n|\r|\n/).join(' ').split(' ');
    let dynamFontSize = fontSize;
    ctx.font = dynamFontSize + 'px "Segoe UI",Arial,sans-serif';
    // while there's tokens left
    while (tokens.length > 0) {
      let width = 0, i;
      for (i = tokens.length; i > 0; i--) {
        width = ctx.measureText(tokens.slice(0, i).join(' ')).width;
        // if it fits
        if (width <= maxWidth) {
          break;
        }
        // if someone makes one big old string this SHOULD reduce the font to a degree where it fits
        if (width > maxWidth && tokens.length === 1) {
          dynamFontSize--;
          ctx.font = dynamFontSize + 'px "Segoe UI",Arial,sans-serif';
          i++;
        }
      }
      if (i == 0) {
        return { lines };
      }
      // slice by calculated amount of words
      result = tokens.slice(0, i).join(' ');
      lines.push(result);
      width = Math.max(width, ctx.measureText(result).width);
      tokens = tokens.slice(i);
      // if there's over 3 lines, it's going to start getting cramped, so reduce the font size, and run again
      if (lines.length > 3) {
        dynamFontSize--;
        ctx.font = dynamFontSize + 'px "Segoe UI",Arial,sans-serif';
        tokens = text.split(/\r\n|\r|\n/).join(' ').split(' ');
        lines = [];
      }
    }
    return { lines, dynamFontSize };
  },
  /**
  * Draw the background of the image
  * @param {ctx} ctx
  * @param {Boolean} double Boolean of if this is a double length panel
  */
  drawBackground(ctx, double) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, double ? 600 : 300, 300);
  },
  /**
   * A quick border path to summon
   * @param {ctx} ctx
   * @param {Canvas} canvas
   */
  borderPath(ctx, canvas) {
    // start
    ctx.moveTo(10, 5);
    // top line
    ctx.lineTo(canvas.width - 10, 5);
    // top right curve
    ctx.arcTo(canvas.width - 5, 5, canvas.width - 5, 10, 5);
    // right line
    ctx.lineTo(canvas.width - 5, canvas.height - 10);
    // bottom right curve
    ctx.arcTo(canvas.width - 5, canvas.height - 5, canvas.width - 10, canvas.height - 5, 5);
    // bottom line
    ctx.lineTo(10, canvas.height - 5);
    // bottom left curve
    ctx.arcTo(5, canvas.height - 5, 5, canvas.height - 10, 5);
    // left line
    ctx.lineTo(5, 10);
    // top left curve
    ctx.arcTo(5, 5, 10, 5, 5);
  },
   /**
   * Draws the border of the panel
   * @param {ctx} ctx
   * @param {canvas} canvas
   */
  drawBorder(ctx, canvas) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    this.borderPath(ctx, canvas);
    ctx.stroke();
  },
};