const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  // TODO: change to isGroup
  is_group: {
    type: Boolean,
    default: false
  },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

module.exports.Chat = mongoose.model('Chat', chatSchema);
