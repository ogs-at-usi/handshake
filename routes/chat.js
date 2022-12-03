const express = require('express');
const router = express.Router();
const { UserChat } = require('../models/userChat');
const { ObjectId } = require('mongodb');
const { User } = require('../models/user');
const { Chat } = require('../models/chat');
const { Message, MessageType } = require('../models/message'); // MessageType is used for verification
const io = require('../serverSocket').io;
/**
 * Responds an array of users that match what the client typed
 */
router.get('/users', async function (req, res) {
  const filter = req.query.filter ?? '';

  const searchedUsers = await User.find({
    name: {
      $regex: `^${filter}`,
    },
  });

  res.json(searchedUsers);
});

/*
 * Responds a created chat between users and returns the new chat
 */
router.post('/chat', async function (req, res) {
  const otherId = req.body.otherId;

  if (!ObjectId.isValid(otherId)) {
    return res.status(400).end();
  }

  const otherUser = await User.findOne({
    _id: ObjectId(otherId),
  });
  if (!otherUser) {
    return res.status(400).end();
  }

  const user = await User.findOne({
    _id: ObjectId(req.userId),
  });

  if (!user) {
    return res.status(406).end();
  }

  let otherUserChats = await UserChat.find({
    user: otherUser._id,
  })
    .populate('chat')
    .exec();
  otherUserChats = otherUserChats.map((userChat) => userChat.chat);

  let userChats = await UserChat.find({
    user: user._id,
  })
    .populate('chat')
    .exec();
  userChats = userChats.map((userChat) => userChat.chat);

  const commonChats = otherUserChats.filter(
    (value) =>
      userChats.findIndex(
        (uc) => uc._id.toString() === value._id.toString()
      ) !== -1
  );

  if (commonChats.length === 0) {
    // create
    const chat = await Chat.create({
      is_group: false,
      messages: [],
    });
    const chatId = chat._id;

    await UserChat.create({
      user: user._id,
      chat: chatId,
    });
    await UserChat.create({
      user: otherUser._id,
      chat: chatId,
    });

    const userSocket = [io.sockets.adapter.rooms.get(req.userId)];
    const otherSocket = [io.sockets.adapter.rooms.get(otherId)];
    userSocket.join(chatId.toString());
    otherSocket.join(chatId.toString());

    io.to(req.userId).to(otherId).emit('chats:created', chat);

    res.status(201).json(chat);
  } else {
    // Not meant to happen that a chat already exists between the users
    res.status(400).json({
      message: 'Error, a chat already exists',
      commonChats,
    });
  }
});

/*
 * Responds a created a new message and returns the new message
 */
router.post('/chat/:chatId/messages', async function (req, res) {
  const chatId = req.params.chatId;
  if (!ObjectId.isValid(chatId)) {
    return res.status(400).end();
  }

  const message = req.body.message;
  if (
    message?.type === undefined ||
    message?.content === undefined ||
    message.content.length === 0 ||
    !Object.values(MessageType).includes(message?.type)
  ) {
    return res.status(400).end();
  }

  const result = await UserChat.findOne({
    chat: new ObjectId(chatId),
    user: new ObjectId(req.userId),
  });
  console.log(
    `Route: /chat/:chatId/messages, params: ${req.params}, body: ${req.body} - Chat of the new message: ${chatId}`
  );
  if (!result) {
    return res.status(404).end();
  }

  const newMessage = await Message.create({
    sender: ObjectId(req.userId),
    chat: ObjectId(chatId),
    type: message.type,
    content: message.content,
    sent_at: new Date(),
    delivered_at: new Date(),
  });

  // socket io emit to all users in the chat room that a new message has been created and send the new message
  io.to(req.params.chatId).emit('messages:create', newMessage);

  res.status(201).json(newMessage);
});

module.exports = router;
