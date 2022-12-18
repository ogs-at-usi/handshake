class Message {
  _id = null;
  sender = null; // user FK
  chat = null; // chat FK
  type = null;
  content = null;
  sentAt = null;
  deliveredAt = null;
  seen = null; // Array of user FKs

  constructor({
    _id = null,
    sender = null,
    chat = null,
    type = null,
    content = null,
    sentAt = null,
    deliveredAt = null,
    seen = null,
  }) {
    this._id = _id && _id.toString(); // message create from not existent chat in db (new chat start)
    this.sender = sender;
    this.chat = chat;
    this.type = type;
    this.content = content;
    this.sentAt = sentAt;
    this.deliveredAt = deliveredAt;
    this.seen = seen;
  }
}

module.exports = { Message };
