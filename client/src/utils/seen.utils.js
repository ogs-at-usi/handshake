export function userSeenMessage(socket, chatId, lastMessageTime) {
  socket.emit('message:update:read', {
    chatId,
    lastMessageTime,
  });
}
