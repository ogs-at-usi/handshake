const { User } = require('./user');
const { Message } = require('./message');

class Chat {
  _id = null;
  members = null;
  messages = null;
  isGroup = false;

  constructor({
    _id = null,
    members = null,
    messages = null,
    isGroup = false,
  }) {
    this._id = _id && _id.toString(); // user select from search and no common chat
    this.isGroup = isGroup;
    this.members =
      members && members.map((m) => (m instanceof User ? m : new User(m)));
    this.messages =
      messages &&
      messages.map((m) => (m instanceof Message ? m : new Message(m)));
  }
}

module.exports = { Chat };
