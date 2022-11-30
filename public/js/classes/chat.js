class Chat {
    _id = null;
    members = null;
    messages = null;

    constructor({ _id = null, members = null, messages = null }) {
        this._id = _id;
        this.members = members;
        this.messages = messages;
    };
};