## Socket User & Server
### Login 
1. Socket connects
2. Join room 'userID' socket.useID
3. Retrieve user's chats 
4. For each chat, join it (chat_id)
5. Server Emit 'chats' to socket


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
