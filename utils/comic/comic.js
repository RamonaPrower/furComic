const introGen = require('../panel/introPanel');
const Canvas = require('canvas');

module.exports = {
    /**
     * Creates the comic based on the number of panels, and how it can fit onto one image
     * @param {Array} panels This is an array containing canvas objects of each panel
     * @param {Speakers}
     * @returns {Buffer} Returns the whole canvas, in a PNG buffer
     */
    async createComic(panels, speakers) {
        const comicOptions = this.decideSizes(panels.length);
        const canvas = Canvas.createCanvas(comicOptions.width * 300, comicOptions.height * 300);
        const ctx = canvas.getContext('2d');
        const introPanel = await introGen.createIntro(speakers, comicOptions.doubleIntro);
        let i = 0;
        for (let j = 0; j < comicOptions.height; j++) {
            for (let k = 0; k < comicOptions.width; k++) {
                if (j === 0 && k === 0) {
                    ctx.drawImage(introPanel, 0, 0);
                    if (comicOptions.doubleIntro === true) {
                        k++;
                    }
                }
                else {
                    ctx.drawImage(panels[i], (300 * k), (300 * j));
                    i++;
                }

            }
        }
        return canvas.toBuffer();
    },
    /**
     * A Case-break statement for generating the size of the comic creator
     * @param {Number} panelAmount This is the amount of panels are in the array
     * @returns {Object}
     */
    decideSizes(panelAmount) {
        const panelOptions = {};
        // i'll make this algoritmic later on
        // width hardcoding
        switch (panelAmount) {
            case 1:
                panelOptions.width = 2;
                panelOptions.height = 1;
                break;
            case 2:
                panelOptions.width = 3;
                panelOptions.height = 1;
                break;
            case 3:
                panelOptions.width = 2;
                panelOptions.height = 2;
                break;
            case 4:
                panelOptions.width = 3;
                panelOptions.height = 2;
                panelOptions.doubleIntro = true;
                break;
            case 5:
                panelOptions.width = 3;
                panelOptions.height = 2;
                break;
            case 6:
                panelOptions.width = 4;
                panelOptions.height = 2;
                panelOptions.doubleIntro = true;
                break;
            case 7:
                panelOptions.width = 4;
                panelOptions.height = 2;
                break;
            case 8:
                panelOptions.width = 3;
                panelOptions.height = 3;
                break;
        }
        return panelOptions;
    },
};