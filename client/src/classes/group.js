class Group extends Chat {
  _id = null;
  title = null;
  description = null;

  constructor({
    _id = null,
    members = null,
    messages = null,
    title = null,
    description = null,
  }) {
    super({ _id, members, messages, isGroup: true });
    this.title = title;
    this.description = description;
  }
}
