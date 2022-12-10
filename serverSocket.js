const io = require('socket.io')();
const { UserChat } = require('./models/userChat');
const { authMiddleware } = require('./middlewares/socket.middleware');
const { ObjectId } = require('mongodb');


// Initialize the socket.io server
function init(server) {
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

    const chats = userChats;
    // find all the users in each chat ad add it as a property 'members'
    return await Promise.all(
      chats.map(async (chat) => {
        const members = await UserChat.find({ chat: chat._id })
          .populate('user')
          .exec();
        return { ...chat._doc, members: members.map((member) => member.user) };
      })
    );
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

    socket.on('disconnect', () => {
      console.log('⛔User disconnected with id ' + socket.id);
      socket.leave(socket.userId);
    });

    socket.on('join-room', (roomId, userId) => {
    console.log('join-room', roomId, userId);
    const newroom = "videocall_"+roomId;
    socket.join(newroom);
    socket.broadcast.to(newroom).emit('user-connected', userId, roomId)
      
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
    
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