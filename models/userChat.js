const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const userChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
});

module.exports.UserChat = mongoose.model('UserChat', userChatSchema);
