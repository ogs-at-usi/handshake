const io = require('socket.io')();
const { UserChat } = require('./models/userChat');
const { authMiddleware } = require('./middlewares/socket.middleware');
const { ObjectId } = require('mongodb');
const ChatData = require('./models/classes/chat').Chat;

/**
 * Initialize the socket.io server.
 * @param server object reference for the server
 */
function init(server) {
  io.attach(server);
  io.use(authMiddleware);

  /**
   * Retrieve all the user chats with members populated sorted by last message sent
   * TODO: use the dataclass class to return the chats to the user: models/classes/chat.js
   * @param userId {String} the userId from db
   * @returns {Promise<[Chat]>} the chats array as promise
   */
  async function getChats(userId) {
    // get chat objects and sort them by last message date
    const userChatRelations = await UserChat.find({ user: ObjectId(userId) })
      .populate({
        path: 'chat',
        populate: { path: 'messages' }
      })
      .sort({ 'chat.messages.date': -1 })
      .exec();

    // fire condition - if none, return immediately empty array
    if (!userChatRelations) return [];

    // // get chat objects and sort them by last message date
    const userChats = userChatRelations.map((ucr) => ucr.chat);

    // find all the users in each chat, retrieve it and add them as property 'members'
    return await Promise.all(
      userChats.map(async c => {
        const UserChatMembers = await UserChat.find({ chat: c._id }).populate('user').exec();
        const members = UserChatMembers.map(ucm => ucm.user);
        return new ChatData({ ...c._doc, members });
      })
    );
  }

  io.on('connection', async socket => {
    console.log(`✅User connected with id ${socket.id} ${socket.userId}`);
    socket.join(socket.userId);
    const userChats = await getChats(socket.userId);
    const userChatsIds = userChats.map(c => c._id);
    joinRooms(userChatsIds, socket);
    socket.emit('chats:read', JSON.stringify(userChats));
    socket.on('disconnect', () => console.log(`⛔User disconnected with id ${socket.id}`));
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
