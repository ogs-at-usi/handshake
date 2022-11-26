class User {

    #_id;
    #name;
    #password;
    #email;

    constructor({ _id, name, password, email }) {
        this._id = _id;
        this.name = name;
        this.password = password;
        this.email = email;
    };

    get id() { return this.#id; };
    get name() { return this.#name; };
    get password() { return this.#password; };
    get email() { return this.#email; };

};