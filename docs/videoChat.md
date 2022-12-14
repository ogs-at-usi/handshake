
# Videochat 


## Caller
When the user is calling another user, has to click the button of videochat in the chat with other user.

The button will activate the function ``calling()`` that will change the VUE component to ``videoChat.vue``. 

In the component will be visible the video of the caller and three buttons:
- Mute/Unmute
- Cam on/off
- Quit call

The ``callling()`` activate the ``socket.emit('join-room')`` to join in the new room that has default name ``"videoChat_" ``+``chatId``. If the user is the only one in the room, then is also the creator and will emit a broadcast socket to the users in the room of chatId for receive an advise that are being called.

## Receiver
The receiver will receive an advise that someone is calling. A pop-up will show up with the name of the caller and two buttons:
- Accept 
- Reject

Accept button will accept the videocall and will make join the user in the new socket room and there will be a link between the users through the peerjs server to connect the streams of each of them.

The receiver will take the cams of the other user and the caller will update the component with the cam of the receiver.

