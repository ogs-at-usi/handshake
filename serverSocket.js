const io = require('socket.io')();
const { UserChat } = require('./models/userChat');
const { authMiddleware } = require('./middlewares/socket.middleware');
const { ObjectId } = require('mongodb');

// Initialize the socket.io server

function init(server, onlineUsers) {
  io.attach(server);

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
        return { ...chat._doc, members: members.map((member) => member.user) };
      })
    );

    /**
     * chats: [ chat, chat, chat ]
     * chat: {_id: '...', members: [user, user, user], messages: [message, message, message]}
     * user: {_id: '...', name: '...', email: '...', password: '...', online: ?}
     */

    chats = chats.map((chat) => {
      chat.members = chat.members.map((member) => {
        return {
          ...member._doc,
          online: onlineUsers.has(member._id.toString()),
        };
      });
      return chat;
    });

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
      console.log(socket.userId + ' is typing in chat ' + chatId);
      io.to(chatId).emit('user:typing', { chatId, userId: socket.userId });
    });

    socket.on('user:notTyping', (data) => {
      const { chatId } = data;
      console.log(socket.userId + ' is not typing in chat ' + chatId);
      io.to(chatId).emit('user:notTyping', { chatId, userId: socket.userId });
    });
  });
}

function joinRooms(rooms, socket) {
  if (!Array.isArray(rooms)) {
    rooms = [rooms];
  }
  if (!Array.isArray(socket)) {
    socket = [socket];
  }
  rooms.forEach((room) => {
    socket.forEach((socket) => {
      socket.join(room);
    });
  });
}

module.exports = {
  init,
  joinRooms,
  io,
};
