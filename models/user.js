const mongoose = require('mongoose');
const { RefreshToken } = require('./refreshToken');
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
userSchema.pre('remove', { document: true, query: true }, function (next) {
  RefreshToken.deleteMany({ user: this._id }, next);
});

module.exports.User = mongoose.model('User', userSchema);
