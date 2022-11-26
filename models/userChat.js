const userChatSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
});

module.exports.UserChat = mongoose.model('UserChat', userChatSchema);