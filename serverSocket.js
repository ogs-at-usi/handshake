const io = require('socket.io')();
// import modules to retreiwe data from db
// const { UserChat } = require('../models/userChat');
// const { ObjectId } = require('mongodb');
const { UserChat } = require('./models/userChat');
// const { User } = require('./models/user');
const { authConstants } = require('./constants/auth.constants');
const { verifyJWT } = require('./utils/jwt.utils');
// const { Chat } = require('./models/chat');

function init(server) {
  io.attach(server);

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
    // retrieve the user's chats directly from the db
    // joinChat(socket.userID);
    socket.join(socket.userID);
    const userChat = getChats(socket.userID);
    joinChat(userChat, socket);
    // send the user's chats to the client
    socket.emit('chats:read', userChat);

    socket.on('disconnect', () => {
      console.log('⛔User disconnected with id ' + socket.id);
    });
  });
}

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

// join in every chat room of the user
function joinChat(userChats, socket) {
  userChats.forEach((chat) => {
    socket.join(chat._id.toString());
  });
}

module.exports = {
  init,
  io
};
