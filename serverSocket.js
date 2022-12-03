const io = require('socket.io')();
const { UserChat } = require('./models/userChat');
const { authMiddleware } = require('./middlewares/socket.middleware');

function init(server) {
  io.attach(server);

  async function getChats(userId) {
    const [error, userChats] = await UserChat.find({ user: userId })
      .populate('chat')
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
    socket.join(socket.userID);
    const userChats = getChats(socket.userID);
    joinRooms(userChats, socket);
    socket.emit('chats:read', userChats);

    socket.on('disconnect', () => {
      console.log('⛔User disconnected with id ' + socket.id);
    });
  });
}

function joinRooms(userChats, socket) {
  if (!Array.isArray(userChats)) {
    socket.join(userChats);
  } else {
    userChats.forEach((chat) => {
      socket.join(chat._id.toString());
    });
  }
}

module.exports = {
  init,
  joinRooms,
  io,
};
