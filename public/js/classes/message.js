class Message {
    _id = null;
    sender = null;
    chat = null;
    type = null;
    content = null;
    sent_at = null;
    delivered_at = null;
    seen = null;

    constructor({ _id = null, sender = null, chat = null, type = null, content = null, sent_at = null, delivered_at = null, seen = null }) {
        this._id = _id;
        this.sender = sender;
        this.chat = chat;
        this.type = type;
        this.content = content;
        this.sent_at = sent_at;
        this.delivered_at = delivered_at;
        this.seen = seen;
    };
};