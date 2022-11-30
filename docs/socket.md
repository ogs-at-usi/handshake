## Socket User & Server


### Login 
1. User insert the username and password  and Post(user,pwd) to AUTH (login)
2. User receive the cookie (JWT, RT)
3. The cookies are sent to the server 
4. User establish a connection to the Socket and the socket.userId = userId
5. Socket emit('chats:read', chats) where chats is a list of chat of the user



4. Join room 'userID' socket.useID
5. Retrieve user's chats 
6. For each chat, join it (chat_id)
7. Server Emit 'chats' to socket


### Send message
1. Post /chat/:chatID/messages
			- { type, content}
			- Store the message in the DB
2.  socket emit to the room


### Create room
1. Post /chat 
		 - if the user does not have a chat
2.  messages:create
	


### Future feature
- messages:read
