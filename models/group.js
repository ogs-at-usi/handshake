
const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
});

module.exports.Group = mongoose.model('Group', groupSchema);