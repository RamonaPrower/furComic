const oneSpeaker = require('./oneSpeaker');
const twoSpeakers = require('./twoSpeakers');

/**
 * @typedef {ctx} ctx the ctx object of the canvas
 * @typedef {Canvas} Canvas the Canvas object
 * @typedef {Collection} Speakers The speaker Collection
 * @typedef {Panel} Object The panel object from the script
 */

module.exports = {
  /**
     * Generates promises for each panel, then run them all at the same time
     * @param {Array} script the Array of each script entry
     * @param {Map} speakers the Map of speakers
     */
  async generatePanels(script, speakers) {
    const panelArr = [];
    const ceoOfPromise = [];
    for (const scriptPanel of script) {
      if(scriptPanel.speakers === 1) {
        const panel = oneSpeaker.promiseCreatePanel(scriptPanel, speakers);
        ceoOfPromise.push(panel);
      }
      else if (scriptPanel.speakers === 2) {
        const panel = twoSpeakers.promiseCreatePanel(scriptPanel, speakers);
        ceoOfPromise.push(panel);
      }
      else {throw new Error('This isn\'t supposed to happen');}

    }
    const testPanelHolder = await Promise.allSettled(ceoOfPromise);
    for (const object of testPanelHolder) {
      if (object.status == 'rejected') {
        console.log(object.value);
      }
      panelArr.push(object.value);
    }
    return panelArr;
  },
};