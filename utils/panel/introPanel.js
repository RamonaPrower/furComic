const common = require('./common');
const Canvas = require('canvas');

module.exports = {
    /**
    * adds canvas objects containing each speakers avatar to their respective object
    * @param {Array} names the names Object
    */
    async avatarParallelLoad(names) {
        const ceoOfPromise = [];
        const imagedNames = [];
        for (const line of names) {
            if (line.url) {
                ceoOfPromise.push(this.canvasIdImgLoader(line));
            }
        }
        const avatarHolder = await Promise.allSettled(ceoOfPromise);
        for (const line of avatarHolder) {
            imagedNames.push(line.value);
        }
        return imagedNames;
    },
    /**
* A single promise to load the image into a canvas buffer, and add it to the line object
* @param {Object} line the line object to update
* @async
* @returns {Promise}
*/
    canvasIdImgLoader(line) {
        return new Promise((res) => {
            Canvas.loadImage(line.url).then((image) => {
                line.canvasAvatar = image;
                res(line);
            });
        });
    },
    /**
* This will take the collection of speakers and output them to an intro panel
* @param {Collection} speakers The collection of speakers
* @param {Boolean} double Optional boolean to say if this is double sized
* @returns {Canvas}
*/
    async createIntro(speakers, double) {
        Canvas.registerFont('./fonts/SegoeUI.ttf', { family: 'Segoe UI' });
        const canvas = Canvas.createCanvas(double ? 600 : 300, 300);
        const ctx = canvas.getContext('2d');
        const speakersArr = speakers.array();
        console.log(speakersArr);
        common.drawBackground(ctx, double);

        const userNames = [];
        const offset = 25;
        for (const speaker of speakersArr) {
            userNames.push({ text: speaker.name, offset: offset, url: speaker.avatarUrl });
        }
        await this.renderFursonaNames(ctx, userNames, 26, double);

        return canvas;

    },
    /**
      *
      * @param {ctx} ctx
      * @param {Map} names the Collection (extends map) of the names to draw
      * @param {Number} fontSize the fontsize to draw each line with
      * @param {Boolean} double an optional boolean to dictate whether this needs to be a double sized image
      */
    async renderFursonaNames(ctx, names, fontSize, double) {
        ctx.font = fontSize + 'px "Segoe UI",Arial,sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let i = 0;
        const globalXMiddle = double ? 300 : 150;
        const globalYMiddle = 150;

        const imagedNames = await this.avatarParallelLoad(names);

        imagedNames.unshift({ text: 'A comic starring:', offset: 0 });

        for (const line of imagedNames) {
            const nameLength = ctx.measureText(line.text);
            // the actual size of the text
            const textHeight = nameLength.actualBoundingBoxAscent + nameLength.actualBoundingBoxDescent;
            // the initial offset that the text needs to be for calculation
            const lineYOffset = imagedNames.length * (textHeight / 2);
            if (line.url) {
                const avatar = line.canvasAvatar;
                const xHeight = textHeight;
                const yWidth = textHeight;
                const radius = textHeight / 2;

                const imgWidthAndPadd = (yWidth + 5);
                const lineWidthOffset = ((nameLength.width / 2) - line.offset);

                // xpos is half the width of the canvas, minus ((half of the length of the text) - the initial offset of the line) - (the width of the image + 5px for padding)
                const xPos = globalXMiddle - lineWidthOffset - imgWidthAndPadd;

                const initPosPlusHalfTextHeight = (lineYOffset + (textHeight / 2));
                const textHeightTimesPosition = (textHeight * i);
                const paddingTimesPosition = (5 * i);

                const yPos = (globalYMiddle - initPosPlusHalfTextHeight) + textHeightTimesPosition + paddingTimesPosition;

                ctx.save();
                ctx.beginPath();
                ctx.arc(xPos + (xHeight / 2), yPos + (yWidth / 2), radius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, xPos, yPos, xHeight, yWidth);
                ctx.restore();
            }
            //  ok so this line is a doozy
            // it's baseHeight - offset, then add a lineHeight times position + padding based on which line it is
            ctx.fillText(line.text, globalXMiddle + line.offset, (150 - lineYOffset) + (textHeight * i) + (5 * i));
            i++;
        }

    },
};