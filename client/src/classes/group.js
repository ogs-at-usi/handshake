const { Chat } = require('./chat');

class Group extends Chat {
  _idGroup = null;
  title = null;
  description = null;

  constructor({
    _idGroup = null,
    _id = null,
    members = null,
    messages = null,
    title = null,
    description = null,
  }) {
    super({ _id, members, messages, isGroup: true });
    this._idGroup = _idGroup && _idGroup.toString();
    this.title = title;
    this.description = description;
  }
}

module.exports = { Group };
