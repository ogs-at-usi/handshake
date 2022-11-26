
const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    title: String,
    description: String,
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
});

module.exports.Group = mongoose.model('Group', userSchema);