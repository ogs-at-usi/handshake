export function userSeenMessage(socket, chatId, lastMessageTime) {
  socket.emit('messages:update:read', {
    chatId,
    lastMessageTime,
  });
}
