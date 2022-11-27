const { api } = require("../../models/api");
const socket = io();







function sendData(data, chatId) {
    socket.emit("sendData", data, chatId);
}

function joinRoom(chatId) {
    socket.emit("joinRoom", chatId);
}



socket.on("receiveData", function (data, chatId) {

    // refresh data in chat
    api.getChat(chatId).then((chat) => {
        chat.messages = data;
    });


});



module.exports = {
    sendData,
    joinRoom,
};







