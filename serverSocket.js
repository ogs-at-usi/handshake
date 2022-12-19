const io = require('socket.io')();
const { UserChat } = require('./models/userChat');
const { Group } = require('./models/group');
const { authMiddleware } = require('./middlewares/socket.middleware');
const { ObjectId } = require('mongodb');
const { Message } = require('./models/message');

/**
 * Initialize the socket.io server
 * @param server object reference for the server
 * @param onlineUsers set to make it accessible to the socket.io server
 */
function init(server, onlineUsers) {
  io.attach(server);
  io.use(authMiddleware);

  /**
   * Retrieve all the user chats with members populated sorted by last message sent
   * TODO: use the dataclass class to return the chats to the user: models/classes/chat.js
   * @param userId {String} the userId from db
   * @returns {Promise<[Chat]>} the chats array as promise containing users with status
   */
  async function getChats(userId) {
    // get chat objects and sort them by last message date
    const userChatRelations = (
      await UserChat.find({ user: ObjectId(userId) })
        .populate({
          path: 'chat',
          populate: {
            path: 'messages',
          },
        })
        .exec()
    ).sort((a, b) => {
      if (a.chat.messages.length === 0) return 1;
      if (b.chat.messages.length === 0) return -1;
      const aDate = a.chat.messages[a.chat.messages.length - 1].sentAt;
      const bDate = b.chat.messages[b.chat.messages.length - 1].sentAt;
      return bDate - aDate;
    });

    // fire condition - if none, return immediately empty array
    if (!userChatRelations) return [];

    // get chats objects from userChatRelations,
    const userChats = userChatRelations.map((ucr) => ucr.chat);
    // find all the users in each chat and add it as a property 'members' + status
    return await Promise.all(
      userChats.map(async (c) => {
        // get all the members of the chat in userChatRelations
        const userChatRelationsWithUser = await UserChat.find({ chat: c._id })
          .populate('user')
          .exec();

        // get the user members with own status from userChatRelationsWithUser
        const members = userChatRelationsWithUser.map((uc) => ({
          online: onlineUsers.has(uc.user._id.toString()),
          ...uc.user._doc,
        }));

        // get possible groups
        // TODO: add chat field isGroup in schema
        const groupMatch = await Group.findOne({ chat: c._id }).exec();
        const groupFields = groupMatch
          ? {
              _idGroup: groupMatch._doc._id,
              title: groupMatch._doc.title,
              description: groupMatch._doc.description,
            }
          : {};

        // return chat raw object
        return { members, ...groupFields, ...c._doc };
      })
    );
  }

  io.on('connection', async (socket) => {
    console.log(`✅User connected with id ${socket.id} ${socket.userId}`);
    socket.join(socket.userId);
    const userChats = await getChats(socket.userId);
    joinRooms(
      userChats.map((chat) => chat._id.toString()),
      socket
    );
    socket.emit('chats:read', userChats);

    socket.on('messages:update:read', ({ chatId, lastMessageTime }) => {
      console.log(chatId, lastMessageTime);
      Message.updateMany(
        {
          seen: { $ne: ObjectId(socket.userId) },
          deliveredAt: { $lte: new Date(lastMessageTime) },
          chat: { $eq: ObjectId(chatId) },
        },
        {
          $push: { seen: ObjectId(socket.userId) },
        }
      ).exec((error, success) => {
        if (error) {
          console.log(error);
        } else {
          console.log(success);
        }
      });
      io.to(chatId).emit('messages:update:read', {
        chatId,
        lastMessageTime,
        userId: socket.userId,
      });
    });

    onlineUsers.add(socket.userId);
    io.emit('users:online', socket.userId);

    socket.on('disconnect', () => {
      console.log('⛔User disconnected with id ' + socket.id);

      onlineUsers.delete(socket.userId);
      io.emit('users:offline', socket.userId);
    });

    socket.on('user:typing', (data) => {
      const { chatId } = data;
      io.to(chatId).emit('user:typing', { chatId, userId: socket.userId });
    });

    socket.on('user:notTyping', (data) => {
      const { chatId } = data;
      io.to(chatId).emit('user:notTyping', { chatId, userId: socket.userId });
    });

    socket.on('videochat:join', async (roomId, userId, chatName) => {
      const newRoom = 'videocall_' + roomId;
      socket.join(newRoom);
      const sockets = await io.to(newRoom).fetchSockets();
      if (sockets.length === 1) {
        socket.broadcast.to(roomId).emit('videochat:notify', chatName, roomId);
      }
      socket.broadcast.to(newRoom).emit('videochat:joined', userId, roomId);

      socket.on('disconnect', () => {
        socket.leave(newRoom);
        socket.broadcast.to(newRoom).emit('videochat:left', userId);
      });

      socket.on('videochat:quit', () => {
        // socket.broadcast.to(newRoom).emit('videochat:left');

        socket.leave(newRoom);
        io.to(newRoom).emit('videochat:left');
        // print all the sockets in the room
        console.log(io.sockets.adapter.rooms.get(newRoom));
        console.log('leave-room: ', newRoom);
        console.log(io.sockets.adapter.sids.get(socket.id));
      });
    });
  });
}

/**
 * Join the sockets to all the rooms
 * TODO: change the mutable parameters rooms and sockets that can also be
 * TODO: a single room or socket if not an array.
 * TODO: e.g. throw a silent error if the object is not an array and in the calling
 * TODO: method report the problem in the server and make the calling request fail.
 * @param rooms{[String]} array of room ids
 * @param sockets{Array} array of sockets objects
 */
function joinRooms(rooms, sockets) {
  if (!Array.isArray(rooms)) rooms = [rooms];
  if (!Array.isArray(sockets)) sockets = [sockets];
  rooms.forEach((r) => sockets.forEach((s) => s.join(r)));
}

module.exports = {
  init,
  joinRooms,
  io,
};
