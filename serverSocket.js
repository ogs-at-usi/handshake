const io = require('socket.io')();
const { UserChat } = require('./models/userChat');
const { authConstants } = require('./constants/auth.constants');
const { verifyJWT } = require('./utils/jwt.utils');

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

  io.use((socket, next) => {
    const jwtToken = socket.request.cookies[authConstants.JWT_COOKIE_NAME];

    try {
      const userID = verifyJWT(jwtToken);
      socket.userID = userID;
      next();
    } catch (e) {
      console.log(e);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('✅User connected with id ' + socket.id);
    console.log('Chat list is coming...');
    socket.join(socket.userID);
    const userChat = getChats(socket.userID);
    joinChat(userChat, socket);
    socket.emit('chats:read', userChat);

    socket.on('disconnect', () => {
      console.log('⛔User disconnected with id ' + socket.id);
    });
  });
}

function joinChat(userChats, socket) {
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
  joinChat,
  io,
};
