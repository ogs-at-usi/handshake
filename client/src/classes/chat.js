import User from '@/classes/user';
import Message from '@/classes/message';

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
    this.members =
      members &&
      members.map((member) =>
        member instanceof User ? member : new User(member)
      );
    this.messages =
      messages &&
      messages.map((message) =>
        message instanceof Message ? message : new Message(message)
      );
    this.isGroup = isGroup;
  }
}

export default Chat;
