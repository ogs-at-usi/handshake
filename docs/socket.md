## Socket User & Server


### Login 
1. User insert the username and password  and Post(user,pwd) to AUTH (login)
2. User receive the cookie (JWT, RT)
3. The cookies are sent to the server 
4. User establish a connection to the Socket and the socket.userId = userId
5. The userId will join all the room of the chats, socket.join(chatId)
6. Socket emit('chats:read', chats) 
 	- chats is a list of chat of the user

### Send Message
1. User send an http request  Post /chat/:chatID/messages
			- messages is  { type, content}
2.  socket emit to the room, io.to(chatId).emit('messages:create', 'message');


### Retrieve contact 
1. User send an http request POST /chat:
2. If the user does not have a chat with the other user:
  		- The socket of the users will be added in the room socket.join(chatId)
  		- socket.emit ('chats:create')
	


### Future feature
- messages:read a flag if the message has been readed already.
