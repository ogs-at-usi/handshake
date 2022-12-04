const io = require('socket.io')();
const { UserChat } = require('./models/userChat');
const { authMiddleware } = require('./middlewares/socket.middleware');
const { ObjectId } = require('mongodb');

// Initialize the socket.io server
function init(server) {
  io.attach(server);

  async function getChats(userId) {
    const userChats = await UserChat.find({ user: ObjectId(userId) })
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

    const chats = userChats.map((userChat) => userChat.chat);
    // find all the users in each chat ad add it as a property 'members'
    for (const chat of chats) {
      const members = await UserChat.find({ chat: chat._id })
        .populate('user')
        .exec();
      chat.members = members.map((member) => member.user);
    }
    return chats;
  }

  io.use(authMiddleware);

  io.on('connection', async (socket) => {
    console.log('✅User connected with id ' + socket.id, socket.userId);
    console.log('Chat list is coming...');
    socket.join(socket.userId);
    const userChats = await getChats(socket.userId);
    joinRooms(
      userChats.map((chat) => chat._id.toString()),
      socket
    );
    socket.emit('chats:read', userChats);

    socket.on('disconnect', () => {
      console.log('⛔User disconnected with id ' + socket.id);
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
