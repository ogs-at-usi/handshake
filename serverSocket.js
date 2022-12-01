/* eslint-disable no-unused-vars */
const io = require('socket.io')();
// import modules to retreiwe data from db
// const { UserChat } = require('../models/userChat');
const { ObjectId } = require('mongodb');
const { UserChat } = require('./models/userChat');
const { User } = require('./models/user');
const { authConstants } = require('./constants/auth.constants');
const { verifyJWT } = require('./utils/jwt.utils');
const { Chat } = require('./models/chat');


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
        joinChat(socket.userID);
        const userChat = getChat(socket.userID);
        // send the user's chats to the client
        socket.emit('chats:read', userChat);

        
        
        
        socket.on('disconnect', () => {
            console.log('⛔User disconnected with id ' + socket.id);
        });

        socket.on('messages:create', (message) => {
            console.log('message: ' + message);
            io.to(message.chatID).emit('messages:create', message);
            
        });
        


    });




}






function getChat (userId) {

    UserChat.find({user: userId}).populate('chat').exec(function (err, userChats) {
        if (err) {
            console.log(err);
        } else {
            console.log("userChats: " + userChats);
            return userChats;
        }
    });
}

// join in every chat room of the user 
function joinChat (userId) {

    UserChat.find({user: userId}).populate('chat').exec(function (err, userChats) {
        if (err) {
            console.log(err);
        } else {
            console.log("userChats: " + userChats);
            userChats.forEach(userChat => {
                console.log("userChat: " + userChat);
                io.join(userChat.chat._id);
            });
        }
    });

}




module.exports = {
    init
};

