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
  const { otherId } = req.body;

  // retrieve other user and current user chats object
  if (!ObjectId.isValid(otherId)) return res.status(400).end();
  const otherUser = await User.findById(otherId);
  if (!otherUser) return res.status(400).end();
  const otherUserChatRelations = await UserChat.find({ user: otherUser._id }).populate('chat').exec();
  const otherUserChat = otherUserChatRelations.map((ucr) => ucr.chat);

  const user = await User.findById(req.userId);
  if (!user) return res.status(406).end();
  const userChatRelations = await UserChat.find({ user: user._id }).populate('chat').exec();
  const userChat = userChatRelations.map((ucr) => ucr.chat);

  // find the chat between the two users
  const commonChats = otherUserChat.filter(ouc =>
      userChat.some(uc => uc._id.toString() === ouc._id.toString())
  );

  if (commonChats.length > 0) {
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
  const members = membersUserChatRelations.map(uc => uc.user);
  const onlineUsers = req.app.locals.onlineUsers;
  const membersWithStatus = members.map(m => {
    return {
      ...m._doc,
      online: onlineUsers.has(m._id.toString()),
    };
  });
  const chatData = new ChatData({ ...chat._doc, members: membersWithStatus });
  membersWithStatus.forEach((m) => io.to(m._id).emit('chats:create', chatData));
  res.status(201).json(chat);
});

/**
 * Create a new message in a chat with the current logged user and broadcast the new message
 * the route receives { message } JSON object in POST body
 */
router.post('/chats/:chatId/messages', async function (req, res) {
  console.log(
    'Route: /chat/:chatId/messages, ' +
    `params: ${req.params}, body: ${req.body} - ` +
    `Chat of the new message chatId in params`
  );

  const { chatId } = req.params;
  if (!ObjectId.isValid(chatId)) return res.status(400).end();

  const message = new MessageData(req.body.message);
  // verify message validity TODO: add self-check in class as method
  if (
    message?.type === undefined ||
    message?.content === undefined ||
    message.content.length === 0 ||
    !Object.values(MessageType).includes(message?.type)
  ) return res.status(400).end();

  // check if chat of the current user exists
  const userChat = await UserChat.findOne({
    chat: new ObjectId(chatId),
    user: new ObjectId(req.userId),
  });
  if (!userChat) return res.status(404).end();

  // add new message and put FK of user chat
  const newMessage = await Message.create({
    sender: ObjectId(req.userId),
    chat: ObjectId(chatId),
    type: message.type,
    content: message.content,
    sentAt: new Date(), // TODO: put send date from the client
    deliveredAt: new Date(),
  });

  // get chat and push the message PK to the messages array
  const chat = await Chat.findById(chatId).exec();
  chat.messages.push(newMessage._id);
  await chat.save();

  // broadcast to chat users in the room a new message has been created
  const newMessageData = new MessageData({ ...newMessage._doc });
  io.to(chatId).emit('messages:create', newMessageData);
  res.status(201).json(newMessage);
});

module.exports = router;
