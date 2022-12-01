const express = require('express');
const router = express.Router();
module.exports = router;
const ObjectID = require('mongodb').ObjectId;
const { UserChat } = require('../models/userChat');
const { ObjectId } = require('mongodb');
const { User } = require('../models/user');
const { Chat } = require('../models/chat');
const { Message } = require('../models/message');

router.get('/users', async function (req, res) {
  const filter = req.query.filter ?? '';

  const searchedUsers = await User.find({
    name: filter,
  });

  res.json(searchedUsers);
});

router.post('/chat', async function (req, res) {
  const otherID = req.body.otherID;

  if (!ObjectID.isValid(otherID)) {
    return res.status(406).end();
  }

  const otherUser = await User.findOne({
    _id: ObjectId(otherID),
  });
  if (!otherUser) {
    return res.status(406).end();
  }

  const user = await User.findOne({
    _id: ObjectId(req.userID),
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
    const chatID = chat._id;

    await UserChat.create({
      user: user._id,
      chat: chatID,
    });
    await UserChat.create({
      user: otherUser._id,
      chat: chatID,
    });

    res.json(chat);
  } else {
    // join
    res.status(204).json(commonChats);
  }
});

router.post('/chat/:chatId/messages', async function (req, res) {
  if (!ObjectID.isValid(req.params.chatId)) {
    return res.status(406).end();
  }

  const message = req.body.message;

  try {
    await UserChat.findOne({
      _id: new ObjectId(req.params.chatId),
      user: new ObjectId(req.userID),
    });

    const newMessage = await Message.create({
      sender: req.userID,
      chat: req.params.chatId,
      type: message.type,
      content: message.content,
      sent_at: new Date(),
      delivered_at: new Date(),
    });

    res.json(newMessage);
  } catch (e) {
    // cant find the chat with the user - error
    res.status(422).end();
  }
});
