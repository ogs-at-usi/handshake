const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const MessageType = Object.freeze({
    text: 'TEXT',
    audio: 'AUDIO',
    image: 'IMAGE',
    video: 'VIDEO',
    document: 'DOCUMENT',
    location: 'LOCATION',
    game: 'GAME'
});


const Message = mongoose.Model('Message', new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    type: {
        type: String,
        enum: Object.values(MessageType),
        default: MessageType.text
    },
    content: {
        type: String,
        default: null
    },
    sentAt: Date,
    deliveredAt: Date,
    seen: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}));

Message.methods.wasViewedBy = (userID) => {
    return this.seen.contains(userID);
}

module.exports = {
    MessageType,
    Message
}