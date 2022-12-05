/* eslint-disable no-unused-vars */
class Message {
  _id = null;
  sender = null;
  chat = null;
  type = null;
  content = null;
  sentAt = null;
  deliveredAt = null;
  seen = null;

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
    this._id = _id;
    this.sender = sender;
    this.chat = chat;
    this.type = type;
    this.content = content;
    this.sent_at = sentAt;
    this.delivered_at = deliveredAt;
    this.seen = seen;
  }
}
