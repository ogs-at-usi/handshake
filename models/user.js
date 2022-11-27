const mongoose = require('mongoose');
const { RefreshToken } = require('./refreshToken');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

userSchema.pre('remove', { document: true, query: true }, function (next) {
  RefreshToken.deleteMany({ user: this._id }, next);
});

module.exports.User = mongoose.model('User', userSchema);
