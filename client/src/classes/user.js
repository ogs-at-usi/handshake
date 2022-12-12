/*
To make it JSON:

const u = new User({ name: 'John'});
const msgtosend = JSON.stringify(u);
> msgtosend;
< {"_id":null,"name":"John","email":null,"chats":null}


To parse it from JSON:

const myjsonresponse = '{"_id":null,"name":"John","email":null,"chats":null}';
const u = new User(JSON.parse(myjsonresponse));
> u;
< User { _id: null, name: 'John', email: null, chats: null }
*/
class User {
  // password not included, never used, only to retrieve token
  _id = null;
  name = null;
  email = null;
  chats = null;
  online = false;
  typing = false;

  constructor({
    _id = null,
    name = null,
    email = null,
    chats = null,
    online = false,
    typing = false,
  }) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.chats = chats;
    this.online = online;
    this.typing = typing;
  }
}

module.exports = { User };
