const {UserChat} = require('../models/userChat');
const {ObjectId} = require('mongodb');
const io = require('socket.io')();



function init (server) {

    io.attach(server);

    io.on('connection', function (socket, user) {
            
            reconectingRooms(user, socket);

            console.log('✅ Client connected with id: ' + socket.id); 
            socket.on('message', function (data) {

                console.log('📨 Message received: ' + data);
                socket.emit('message', data);

            });

            socket.on('disconnect', function () {
                console.log('⛔ Client disconnected with id: ' + socket.id);
            });

            socket.on('sendData', function (data, chatId)   {
                io.to(chatId).emit('message', data);
            });
        });
    }


function reconectingRooms(user, socket) {

   UserChat.find({user: ObjectId(user._id)}).populate("chat").then((userChats) => {
        userChats.forEach((userChat) => {
            socket.join(userChat.chat._id.toString());
            console.log('✅ Client ' + user._id + ' joined chat ' + userChat.chat._id);
        });
    });
}



module.exports.init = init;