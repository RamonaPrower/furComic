// imports
const mongoose = require('mongoose');
const { createEmotionList, emotionMap } = require('../utils/emotions/emotionHandling');


// put the emotion into it's own schema, this is needed for keeping it neat in the db
const emotionSchema = new mongoose.Schema(createEmotionList(), { _id: false });

const userSchema = new mongoose.Schema({
    snowflake: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    emotions: emotionSchema,
}, { minimize: false });

// get a user
userSchema.statics.checkUser = async function(snowflake) {
    const entry = await this.findOne({ snowflake: snowflake });
    return entry;
};

// update an emotion based on the url, checks before to see if it's valid
userSchema.methods.updateEmotion = async function(emotion, url) {
    if (emotionMap.has(emotion)) {
        this.emotions.set(emotion, url);
        await this.save();
        return true;
    }
    else {return false;}
};

const User = mongoose.model('User', userSchema);
exports.User = User;