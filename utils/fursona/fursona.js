const emotionHandling = require('../emotions/emotionHandling');
const { User } = require('../../models/user');
const fetch = require('node-fetch');
const sharp = require('sharp');

/**
 * @typedef {String} snowflake the Snowflake of the user
 */

 /**
  * This creates a default Fursona
  */
class Fursona {
    /**
     * @constructor
     * @param {String} colour the colour to tint the fursona
     */
    constructor(colour) {
        this.emotions = {};
        for (const [key, value] of emotionHandling.emotionMap) {
            this.emotions[key] = value;
        }
        if (colour) {
            this.colour = colour;
        }
        else {this.colour = '#000000';}
    }
    /**
     * Returns a buffered image of the emotion passed
     * @param {String} emotion The emotion to summon
     * @returns {Buffer}
     */
    async getEmotionImageBuffer(emotion) {
        const fetched = await fetch(this.emotions[emotion]);
        const prebuffer = await fetched.buffer();
        const img = await sharp(prebuffer).tint(this.colour).toBuffer();
        return img;
    }
}
/**
 * This creates a custom Fursona
 */
class CustomFursona extends Fursona {
    /**
     * Constructor for the custom fursona
     * @constructor
     * @param {Query} search a mongoose DB document of the user to make the fursona for
     */
    constructor(search) {
        super();
        this.search = search;
        for (const [key, value] of emotionHandling.emotionMap) {
            if (this.search.emotions._doc[key] == 'null') {
                this.emotions[key] = this.search.emotions._doc.idle;
            }
            else {
                this.emotions[key] = this.search.emotions._doc[key];
            }
        }
    }
    /**
     * Lists all the emotions that have been filled out
     * @returns {Object}
     */
    listEmotions() {
        const filledEmotes = [];
        const nonFilledEmotes = [];
        // loop through entries, if it matches the default, it's not been changed
        for (const [key, value] of Object.entries(this.search.emotions._doc)) {
            if (value == 'null') {
                nonFilledEmotes.push(key);
            }
            else {
                filledEmotes.push(key);
            }
        }
        return {
            filled: filledEmotes,
            nonFilled: nonFilledEmotes,
        };
    }
    /**
     * Updates a custom Fursona's string
     * @param {String} emotion a string representation of an emotion
     * @param {String} url the URL to update it to
     */
    async updateEmotion(emotion, url) {
        if (emotionHandling.emotionMap.has(emotion)) {
            const res = await this.search.updateEmotion(emotion, url);
            return res;
        }
        else { return false; }
    }
    /**
     * Returns a buffered image of the emotion passed
     * @param {String} emotion The emotion to summon
     * @returns {Buffer}
     */
    async getEmotionImageBuffer(emotion) {
        const fetched = await fetch(this.emotions[emotion]);
        const prebuffer = await fetched.buffer();
        const img = await sharp(prebuffer).toBuffer();
        return img;
    }
}
async function summonFursona(snowflake, colour) {
    const search = await User.checkUser(snowflake);
    if (!search) {
        return new Fursona(colour);
    }
    else {return new CustomFursona(search);}
}
async function createFursona(snowflake) {
    let search = await User.checkUser(snowflake);
    if (!search) {
        const user = new User({
            snowflake: snowflake,
            emotions: {
                idle: emotionHandling.emotionMap.get('idle'),
            },
        });
        await user.save();
        search = await User.checkUser(snowflake);
    }
    return new CustomFursona(search);
}
module.exports.Fursona = Fursona;
module.exports.CustomFursona = CustomFursona;
module.exports.summonFursona = summonFursona;
module.exports.createFursona = createFursona;