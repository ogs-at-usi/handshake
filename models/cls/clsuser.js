class User {

    #_id;
    #name = null;
    #password = null;
    #email = null;

    #chats = null;  // link

    /**
     * Is chats ever passed in?
     * @param {*} param0 
     */
    constructor({ _id, name = null, password = null, email = null }) {
        this.#_id = _id;
        this.#name = name;
        this.#password = password;
        this.#email = email;
    };

    get name() { return this.#name; };
    get password() { return this.#password; };
    get email() { return this.#email; };

    get chats() { return this.#chats; };

    async retrieveUser() {
        const user = await readUser(this.#id);
        this.#name = user.name;
        this.#password = user.password;
        this.#email = user.email;
    };

    async retrieveChats() {
        this.#chats = await getUserChats(this.#id);
    };
};

module.exports = User;
