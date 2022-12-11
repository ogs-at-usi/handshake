const { UserChat } = require('../models/userChat');
const { ObjectId } = require('mongodb');
const { Chat } = require('../models/chat');
const { Message } = require('../models/message'); // MessageType is used for verification


async function saveMessage(chatId, userId, content, type) {
    const result = await UserChat.findOne({
        chat: new ObjectId(chatId),
        user: new ObjectId(userId),
    });

    console.log(result);

    // console.log(
    //     `Route: /chat/:chatId/messages, params: ${params}, body: ${body} - Chat of the new message: ${chatId}`
    // );

    if (!result) {
        return null;
    }

    const newMessage = await Message.create({
        sender: ObjectId(userId),
        chat: ObjectId(chatId),
        type,
        content,
        sentAt: new Date(),
        deliveredAt: new Date(),
    });

    console.log(newMessage);

    const chat = await Chat.findOne({
        _id: ObjectId(chatId),
    }).exec();

    chat.messages.push(newMessage._id);
    await chat.save();

    return newMessage;
}

module.exports = {
    saveMessage,
};
