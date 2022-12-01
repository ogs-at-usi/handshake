const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshToken = mongoose.model(
  'RefreshToken',
  new Schema({
    token: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    expiresAt: Date,
  })
);

module.exports.RefreshToken = RefreshToken;
