# Routes HTTP

## GET

### /users?filter=userstring
The client request an object with all the users in an array that match the name (or part of it) with the filter value `userstring`.

## POST

### /chat

Create a chat if it doesn't already exist with a user.
server creates the chat, save it to db, with users (2 until M2).
Server emit chat:create to the members of the new chat (2 until M2) with chat object from [Chat](uml.png class.
Server sends back an object containing { chatId, members } to the client.
Triggered when:
- a user wants to chat with another one when they have still not a chat together.

### /chat/:chatId/messages

Message from the client wanting to add a new message to the corresponding *chatId*.
A new _Message_ document from the Mongoose is created and saved to the database.
