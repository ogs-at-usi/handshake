## Socket User & Server


### Login 
1. User insert the username and password  and Post(user,pwd) to AUTH (login)
2. User receive the cookie (JWT, RT)
3. The cookies are sent to the server 
4. User establish a connection to the Socket and the socket.userId = userId
5. The userId will join all the room of the chats, socket.join(chatId)
6. Socket emit('chats:read', chats) 
 	- chats is a list of chat of the user

### Send message
1. User send an http request to Post /chat/:chatID/messages
			- messages is  { type, content}
			- Store the message in the DB
2.  socket emit to the room, io.to(chatId).emit('messages:create', 'message');


### Create room
1. Post /chat 
		 - if the user does not have a chat
2.  messages:create
	


### Future feature
- messages:read
