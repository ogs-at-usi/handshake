const User = require('./user');

class Chat {

    #_id;
    #members;
    #messages = null;

    constructor({ _id, members }) {
        this.#_id = _id;
        this.#members = members;
    };

    get members() { return this.#members; };
    get messages() { return this.#messages; };

    addMessage(message) {
        // reverb to db

    };

    /* NOT USED, POSSIBLE FEATURE
    removeMessage(message) {
    
    }
    */

    addMember(member) {

    };

    async retrieveMembers() {
        this.#members = await getChatMembers(this.#_id);
    };

    async retrieveMessages() {
        this.#messages = await getChatMessages(this.#_id);
    };
};


