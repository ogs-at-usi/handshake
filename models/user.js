const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  email: String,

  chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
});

module.exports.User = mongoose.model('User', userSchema);
