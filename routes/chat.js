const express = require('express');
const router = express.Router();
module.exports = router;
const { UserChat } = require('../models/userChat');
const { ObjectId } = require('mongodb');
const { User } = require('../models/user');
const { Chat } = require('../models/chat');
const { Message, MessageType } = require('../models/message');

router.get('/users', async function (req, res) {
  const filter = req.query.filter ?? '';

  const searchedUsers = await User.find({
    name: {
      $regex: `^${filter}`,
    },
  });

  res.json(searchedUsers);
});

router.post('/chat', async function (req, res) {
  const otherId = req.body.otherId;

  if (!ObjectId.isValid(otherId)) {
    return res.status(406).end();
  }

  const otherUser = await User.findOne({
    _id: ObjectId(otherId),
  });
  if (!otherUser) {
    return res.status(406).end();
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

    res.status(201).json(chat);
  } else {
    // join
    res.status(200).json(commonChats);
  }
});

router.post('/chat/:chatId/messages', async function (req, res) {
  if (!ObjectId.isValid(req.params.chatId)) {
    return res.status(406).end();
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
    chat: new ObjectId(req.params.chatId),
    user: new ObjectId(req.userId),
  });
  console.log(result);
  if (!result) {
    return res.status(404).end();
  }

  const newMessage = await Message.create({
    sender: ObjectId(req.userId),
    chat: ObjectId(req.params.chatId),
    type: message.type,
    content: message.content,
    sent_at: new Date(),
    delivered_at: new Date(),
  });

  res.status(201).json(newMessage);
});
