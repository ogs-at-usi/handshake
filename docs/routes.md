# Routes HTTP

## GET

### /users?filter=userstring
The client request an object with all the users in an array that match the name (or part of it) with the filter value `userstring`.

The `email`, hashed `password` and `chats` fields for the [User](uml.png) are omitted from the User structure given back as response.

The field `_id` is leaved with the preceding underscore to internally emphasize that it needs to be converted to an `ObjectId`.

```json
{
  "users": [
    { 
      "_id": "123abc098",
      "name": "userstr",
    }
  ],
}
```

## POST

### /chat

Create a chat if it doesn't already exist within its members:

Server creates the chat document from the Mongoose model and saves it to db.

**side effect: socket** Server emits [`chat:create`](socket.md) to the online connected new members (event client issuing the request) of the new chat with chat object from [Chat](uml.png) class.

Server sends back an object containing the new chat id to the client who issued the request.
```json
{
  "_id": "123abc098",
}
```

Triggered when:

- a user wants to chat with another one when they have still not a chat together.

### /chat/:chatId/messages

Message from the client wanting to add a new message to the corresponding *chatId*, *which is a member of* in the following [Message](uml.png) format:
```json
{
  "message": {
    "type": "text",
    "content": "mystringcontent",
  }
}
```

The `_id` is created when the message is put on the database.

The `sender` is made in the server, from the header JWT containing the `_id` field of the user (*authorization*).

The `chat` is filled thanks to the `:chatId` parameter in the route (`req.params.chatId`).

The `sent_at` is filled in the server, with the date provided by the backend.

The `delivered_at` and `seen` are also filled server side.


A new _Message_ document from the Mongoose model is created and saved to the database.

The route triggers the reply for the other chat members to update through socket the new message in real-time.
