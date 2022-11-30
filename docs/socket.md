
# Socket User & Server


## Login 

### Auth Socket Middleware
At the login the client has in the header of the requests the Auth Cookies.

The ``JWT_COOKIE_NAME`` will be saved:
``` js
const jwtToken = socket.request.cookies[authConstants.JWT_COOKIE_NAME]; 
``` 
Try to verify the credentials of the user  with the function ```  verifyJWT(jwtToken) ```  and store it  ``socket.userID = userID``


### Joining rooms
User connects to all the rooms ``socket.join(chatID)`` for each ``chatID `` in chat of the user.

###   Socket emit
Socket emit the list of the chat of the user
``socket.emit('chats:read'`, chat)``

chat:
``` json
{
	"chats": {
		"_id": "id",
		"members": "[userID]"
		"messages": "int"
		"isGroup": "bool"
		}
}
```


## Send Message
On sending messages socket will emit the message for the users inside of the room of the chat.

``` js 
io.to(charID).emit('messages:create', 'message')
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
	-      Socket of all the user involed in the chat are added in the room
``` js
io.in(userID).in(userID).join(chatID)
```
 socket will emit the ``chats:create``
```js
 socket.emit ('chats:create')
 ```
	


## Future feature
- messages:read a flag if the message has been readed already.
