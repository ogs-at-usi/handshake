const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    password: String,
    email: String,

    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
});

module.exports.User = mongoose.model('User', userSchema);
