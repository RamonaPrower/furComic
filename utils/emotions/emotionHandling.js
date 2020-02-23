const { emotions, triggers } = require('../../strings/emotions');
// Generate an emotion list based on what is in the strings folder
/**
 * Constructs the list of emotions from the json file
 * this means that i can just add one in, and it slots in perfectly
 */
function createEmotionList() {
    const tempObject = {};
    const emotionMap = new Map(emotions);
    for (const [key, value] of emotionMap) {
        tempObject[key] = {
            type: String,
            default: 'null',
            required: true,
        };
    }
    return tempObject;
}
/**
 * Categorizes the string based on the list of emotions, and other factors such as yelling or questions
 * @param {String} message The message to categorise
 * @returns {String} Emotion to show, as a string
 */
function emotionDecider(message) {
    const possibleEmotions = [];
    const searchMessage = message.toLowerCase();
    const emotionsList = Object.entries(triggers);
    for (const emotion of emotionsList) {
        const regex = new RegExp('\\b(' + emotion[1].join('|') + ')\\b', 'mi');
        if (regex.test(searchMessage)) {
            possibleEmotions.push(emotion[0]);
        }

    }
    if (message.toUpperCase() === message) { possibleEmotions.push('yell'); }
    if (message.endsWith('?')) { possibleEmotions.push('question'); }
    if (message.endsWith('!')) { possibleEmotions.push('yell'); }
    if (possibleEmotions.length === 0) {
        possibleEmotions.push('idle');
        if (Math.random() > 0.7) {
            possibleEmotions.push('happy');
        }
    }
    return possibleEmotions[Math.floor(Math.random() * possibleEmotions.length)];
}

exports.createEmotionList = createEmotionList;
exports.emotionMap = new Map(emotions);
exports.emotionDecider = emotionDecider;
