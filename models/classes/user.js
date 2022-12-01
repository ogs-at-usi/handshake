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
module.exports = require('../../public/js/classes/user');
