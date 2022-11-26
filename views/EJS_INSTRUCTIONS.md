# How to use the ejs files

## Changing the entire page
To change the contents of the whole page, select the element `main` with `id="container"` and overwrite its contents.

```
getElementById("container");
```
This is useful when changing from the login page to the main page.

## Structure of the main page
The main page is divided in two columns. 

The one on the left contains:
- HandShake app name
- User profile picture
- Search bar
- Contacts and groupchats

The one on the right contains the chat view with the text messages.

To add both columns to the main page, follow these instructions.

## Structure of the left column
To add the left column to the main page, use `querySelector("body")` to access the body of the `index.html` page. 

Then overwrite its `innerHTML` with the file named `contactlist.ejs`. Remember to pass it:
- the user's profile picture.
- the user's contacts and groupchats.

The view will automatically append all the contacts to the bottom of the list. 

If you want to manually add a new contact or groupchat, use `querySelector("#menu main")` to access the list of contacts, then add to its `innerHTML` the file `contact.ejs`.

## Structure of the right column
To add the left column to the main page, use `querySelector("body")` to access the body of the `index.html` page. 

IMPORTANT: only do this after you have already added the left column.

Add to its `innerHTML` the file named `chatcontainer.ejs`. It is the container for the actual chat. It won't contain any messages.

When pressing on a contact or a groupchat, its relative chat should open. To do so, use `getElementById("chat")` to access the chat container, then overwrite its `innerHTML` with the file named `chat.ejs`.

The view will automatically append all the messages to the bottom of the chat. 

If you want to manually add a new message, use `querySelector("#chat main")` to access the list of messages, then add to its `innerHTML` the file `message.ejs`.