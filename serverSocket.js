const io = require('socket.io')();
const { UserChat } = require('./models/userChat');
const { authMiddleware } = require('./middlewares/socket.middleware');
const { ObjectId } = require('mongodb');

/**
 * Initialize the socket.io server
 * @param server object reference for the server
 * @param onlineUsers set to make it accessible to the socket.io server
 */
function init(server, onlineUsers) {
  io.attach(server);

  /**
   * Retrieve all the user chats with members populated sorted by last message sent
   * TODO: use the dataclass class to return the chats to the user: models/classes/chat.js
   * @param userId {String} the userId from db
   * @returns {Promise<[Chat]>} the chats array as promise
   */
  async function getChats(userId) {
    let userChats = await UserChat.find({ user: ObjectId(userId) })
      .populate({
        path: 'chat',
        populate: {
          path: 'messages',
        },
      })
      .exec();
    if (!userChats) {
      return [];
    }
    userChats = userChats.map((userChat) => userChat.chat);
    userChats = userChats.sort((a, b) => {
      const lastMessageA = a.messages[a.messages.length - 1];
      const lastMessageB = b.messages[b.messages.length - 1];
      return lastMessageB.sentAt - lastMessageA.sentAt;
    });

    let chats = userChats;
    // find all the users in each chat ad add it as a property 'members'
    chats = await Promise.all(
      chats.map(async (chat) => {
        const members = await UserChat.find({ chat: chat._id })
          .populate('user')
          .exec();
        return {
          ...chat._doc,
          members: members.map((member) => {
            return {
              ...member.user._doc,
              online: onlineUsers.has(member.user._id.toString()),
            };
          }),
        };
      })
    );

    return chats;
  }

  io.use(authMiddleware);

  io.on('connection', async (socket) => {
    console.log('✅User connected with id ' + socket.id, socket.userId);
    socket.join(socket.userId);
    const userChats = await getChats(socket.userId);
    joinRooms(
      userChats.map((chat) => chat._id.toString()),
      socket
    );
    socket.emit('chats:read', userChats);

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
  rooms.forEach(r => sockets.forEach(s => s.join(r)));
}

module.exports = {
  init,
  joinRooms,
  io,
};
