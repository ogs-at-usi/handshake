const { UserChat } = require('../models/userChat');
const { ObjectId } = require('mongodb');
const { Chat } = require('../models/chat');
const { Message } = require('../models/message'); // MessageType is used for verification
const io = require('../serverSocket').io;


async function sendMessage(chatId, userId, message, type, params, body) {
    const result = await UserChat.findOne({
        chat: new ObjectId(chatId),
        user: new ObjectId(userId),
    });

    console.log(
        `Route: /chat/:chatId/messages, params: ${params}, body: ${body} - Chat of the new message: ${chatId}`
    );

    if (!result) {
        return null;
    }

    const newMessage = await Message.create({
        sender: ObjectId(userId),
        chat: ObjectId(chatId),
        type,
        content: message.content,
        sentAt: new Date(),
        deliveredAt: new Date(),
    });

    const chat = await Chat.findOne({
        _id: ObjectId(chatId),
    }).exec();

    chat.messages.push(newMessage._id);
    await chat.save();

    // socket io emit to all users in the chat room that a new message has been created and send the new message
    io.to(chatId).emit('messages:create', newMessage);
}

module.exports = {
    sendMessage,
};
