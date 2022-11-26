class Group extends Chat {

    static DEFAULT_TITLE = "Untitled Group";
    static DEFAULT_DESCRIPTION = "No description provided";

    #title = DEFAULT_TITLE;
    #description = DEFAULT_DESCRIPTION;

    constructor({ _id, title, description, members, messages }) {
        super({ _id, members, messages });
        this.title = title;
        this.description = description;
    };

    get title() { return this.#title; };
    get description() { return this.#description; };

    set title(value) {
        // TODO: reverb to db command and verify ack success
        this.#title = value;
    };

    set description(value) {
        // TODO: reverb to db command and verify ack success
        this.#description = value;
    };
};
