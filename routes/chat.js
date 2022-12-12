const express = require('express');
const router = express.Router();
const { UserChat } = require('../models/userChat');
const { ObjectId } = require('mongodb');
const { User } = require('../models/user');
const { Chat } = require('../models/chat');
const { Message, MessageType } = require('../models/message'); // MessageType is used for verification
const io = require('../serverSocket').io;
const serverSocket = require('../serverSocket');
const ChatData = require('../models/classes/chat').Chat;
const UserData = require('../models/classes/user').User;
const MessageData = require('../models/classes/message').Message;

/**
 * Given a filter string as a query param for usernames.
 * return an array of users that match the filter.
 */
router.get('/users', async function (req, res) {
  const { filter } = req.query;
  const userRegex =  filter?.replace(/[^a-z0-9]/gi, '') ?? '';
  const searchedUsers = await User.find({
    name: { $regex: `^${userRegex}` }
  });
  return res.json(searchedUsers);
});

/**
 * Create a chat between the logged user and the other one passed as parameter in the POST body request.
 * The chat is created only if it doesn't exist yet.
 * Return the newly created chat.
 */
router.post('/chats', async function (req, res) {
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

    serverSocket.joinRooms(
      chatId.toString(),
      await io.to(req.userId).to(otherId).fetchSockets()
    );

    let members = await UserChat.find({ chat: chatId }).populate('user').exec();
    members = members.map((member) => member.user);
    const onlineUsers = req.app.locals.onlineUsers;
    members = members.map((member) => {
      return {
        ...member._doc,
        online: onlineUsers.has(member._id.toString()),
      };
    });
    io.to(req.userId)
      .to(otherId)
      .emit('chats:create', { ...chat._doc, members });

    res.status(201).json(chat);
  } else {
    // Not meant to happen that a chat already exists between the users
    res.status(400).json({
      message: 'Error, a chat already exists',
      commonChats,
    });
  }

  // create the chat in db, make members join the room
  // TODO: add creation in database error handling
  const chat = await Chat.create({ is_group: false, messages: [] });
  await UserChat.create({ user: user._id, chat: chat._id });
  await UserChat.create({ user: otherUser._id, chat: chat._id });
  const socketsMembers = await io.to(req.userId).to(otherId).fetchSockets();
  serverSocket.joinRooms([chat._id.toString()], socketsMembers);

  // retrieve members objects from ids and return the chat to members with status 201
  const membersUserChatRelations = await UserChat.find({ chat: chat._id }).populate('user').exec();
  const members = membersUserChatRelations.map(uc => new UserData(uc.user));
  const chatData = new ChatData({ ...chat._doc, members });
  members.forEach((m) => io.to(m._id).emit('chats:create', JSON.stringify(chatData)));
  res.status(201).json(chat);
});

/**
 * Create a new message in a chat with the current logged user and broadcast the new message
 * the route receives { message } JSON object in POST body
 */
router.post('/chats/:chatId/messages', async function (req, res) {
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
    sentAt: new Date(),
    deliveredAt: new Date(),
  });

  const chat = await Chat.findOne({
    _id: ObjectId(chatId),
  }).exec();

  chat.messages.push(newMessage._id);
  await chat.save();

  // broadcast to chat users in the room a new message has been created
  const newMessageData = new MessageData({ ...newMessage._doc });
  io.to(chatId).emit('messages:create', JSON.stringify(newMessageData));
  res.status(201).json(newMessage);
});

module.exports = router;
