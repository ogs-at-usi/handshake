
# Socket User & Server

## Login 

### Auth Socket Middleware

When the server receives the log in request via [route `GET /auth/login`](routes.md), the header of the client's request has the Auth Cookies.

The `JWT_COOKIE_NAME` will be saved:

``` js
const jwtToken = socket.request.cookies[authConstants.JWT_COOKIE_NAME]; 
```

Verify the user's credentials with the function `verifyJWT(jwtToken)` and store it `socket.userID = userID`.


### Joining rooms

The server connects the user to all its rooms:

- a room corresponding to its own userId

- all the rooms corresponding to the chatId's of the chats the user is a member of

e.g. `socket.join(chatId)` for each `chatId` of a user's chat.

### Socket emit

The server emits to the client, the response object containing an array of all its chats with the `members` and `messages` fields already filled up: `socket.emit('chats:read', chatsjson)`.

chat:

```json
{
  "chats": [
    {
      "_id": "123abc098",
      "isGroup": false,
      "members": [
        {"_id": "111aaa000", "name": "steve", "email": "steve@usi.ch"}, 
        {"_id": "222bbb999", "name": "olaf", "email": "olaf@usi.ch"}
      ],
      "messages": [
        {"_id": "333ccc888", "type": "text", "content": "hello"}, 
        {"_id": "444ddd777", "type": "text", "content": "hi"}
      ]
    }
  ]
}
```


## <a name="send_message"> Send Message </a>

When a message is created via [route POST /chats/:chatId/messages](routes.md), the server socket will emit `messages:create` for all the members of the chat room.

``` js 
io.to(chatId).emit('messages:create', msgjson);
```

message:
``` json
{
  "message": {
    "type": "text",
    "content": "mystringcontent",
  }
}
```


## New chat 

If the user does not have a chat with the other user:

- the client send a request to create the chat via [route `POST /chats`](routes.md), the server creates the chat and returns the chadId as response of the post request.

- All the members of the chat get retrieved by joining the rooms corresponding to their userId's to the chatId rooms.

``` js
io.in(userId).in(userId).join(chatId);
```

- The new chat will be synchronized with the online clients members using the message `chats:create`

```js
 io.in(chatId).emit('chats:create', chatjson);
 ```
 
 - so clients listening on message `chats:create` will sync the newly created chat, adding it to their chats.
 - clients can now [send a message](#send_message)

## Future feature
- messages:read a flag if the message has been readed already.
