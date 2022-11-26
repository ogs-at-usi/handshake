
const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
    is_group: Boolean,
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

module.exports.Chat = mongoose.model('Chat', chatSchema);