const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
    name: String,
    password: Buffer,
    email: String,
});

exports = mongoose.model('UserModel', user);
