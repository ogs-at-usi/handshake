class Chat {

    #_id;
    #members = [];
    #messages = [];

    constructor({ _id, members, messages }) {
        this._id = _id;
        this.members = members;
        this.messages = messages;
    };

    get members() {
        if (this.#members.length > 0 && !(this.#members[0] instanceof User))
            this.#members = this.#members.map(uid => getUser(uid));
        return this.#members;
    };

    get messages() {
        if (this.#messages.length > 0 && !(this.#messages[0] instanceof Message))
            this.#messages = this.#messages.map(mid => getMessage(mid));
        return this.#messages;

    }

    addMessage(message) {
        // reverb to db

    };

    /* NOT USED, POSSIBLE FEATURE
    removeMessage(message) {

    }
    */

    addMember(member) {
        // reverb to db

    };
};
