const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshToken = mongoose.Model(
  'RefreshToken',
  new Schema({
    token: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    expiresAt: Date,
  })
);

module.exports.RefreshToken = RefreshToken;
