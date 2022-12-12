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

  constructor({ _id = null, name = null, email = null }) {
    this._id = _id && _id.toString(); // when users retrieved from search bar
    this.name = name;
    this.email = email;
  }
}

module.exports = { User };
