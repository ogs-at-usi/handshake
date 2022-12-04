const io = require('socket.io')();
const { UserChat } = require('./models/userChat');
const { authMiddleware } = require('./middlewares/socket.middleware');

// Initialize the socket.io server
function init(server) {
  io.attach(server);

  async function getChats(userId) {
    const [error, userChats] = await UserChat.find({ user: userId })
      .populate({
        path: 'chat',
        populate: {
          path: 'messages',
        },
      })
      .exec();
    if (error) {
      console.log(error);
      return [];
    }
    return userChats.map((userChat) => userChat.chat);
  }

  io.use(authMiddleware);

  io.on('connection', (socket) => {
    console.log('✅User connected with id ' + socket.id);
    console.log('Chat list is coming...');
    socket.join(socket.userId);
    const userChats = getChats(socket.userId);
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
