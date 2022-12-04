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
    this._id = _id;
    this.members = members;
    this.messages = messages;
    this.isGroup = isGroup;
  }
}
