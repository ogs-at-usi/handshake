const { model, ObjectId } = require('./index');

const api = function () {

    //#region CRUD
    //#region USER
    /*
    {
        _id: ObjectId,
        name: String,
        password: Buffer,
        email: String,
    }
    */
    /**
     * Retrieve user by id from the database
     * @param {string} uid unique id of user 
     * @returns Promise = user or null
     */
    async function readUser(uid) {
        const query = { _id: ObjectId(uid) };
        const user_db = await model.UserModel.findOne(query);
        return new User(user_db);
    };

    /**
     * Add a user to the database
     * @param {Obj} user name, password, email
     * @returns Promise({acknowledged, insertedId})
     */
    async function createUser({ name, password, email }) {
        const user = { name, password, email };
        return await model.USER.insertOne(user);
    };

    /**
     * Update a user in the database
     * @param {string} uid 
     * @param {User} user 
     * @returns Promise({matchedCount, modifiedCount, upsertedId, acknowledged})
     */
    async function updateUser(uid, { name, password, email }) {
        const query = { _id: ObjectId(uid) };
        const update = { $set: { name, password, email } };
        return model.USER.updateOne(query, update);
    };

    /**
     * Delete a user from the database
     * @param {string} uid 
     * @returns Promise({deletedCount, acknowledged})
     */
    async function deleteUser(uid) {
        const query = { _id: ObjectId(uid) };
        return await model.USER.deleteOne(query);
    };
    //#endregion

    //#region MESSAGE
    /*
    {
        _id: ObjectId,
        sender: ObjectId,
        chat: ObjectId,
        type: [text, image, video, audio, document, location, game],
        content: String?,
        sent_at: Date?,
        delivered_at: Date?,
        read_at: [ObjectId, ...],   // users
    }
    */
    /**
     * Retrieve message by id from the database
     * @param {string} uid unique id of message 
     * @returns Promise with message or null
     */
    async function readMessage(uid) {
        const query = { _id: ObjectId(uid) };
        return await model.MESSAGE.findOne(query);
    };

    /**
     * Create a message to the database
     * @param {Message} message
     * @returns Promise({acknowledged, insertedId}) of add ack message
     */
    async function createMessage({ sender, chat, type, content, sent_at, delivered_at, seen }) {
        const message = { sender, chat, type, content, sent_at, delivered_at, seen };
        return await model.USER.insertOne(message);
    };

    /**
     * Update a message in the database. NOT USED FOR NOW.
     * @param {string} uid 
     * @param {Message} message 
     * @returns Promise({matchedCount, modifiedCount, upsertedId, acknowledged})
     */
    async function updateMessage(uid, { sender, chat, type, content, sent_at, delivered_at, seen }) {
        const query = { _id: ObjectId(uid) };
        const update = { $set: { sender, chat, type, content, sent_at, delivered_at, seen } };
        return await model.USER.updateOne(query, update);
    };

    /**
     * Delete a message from the database
     * @param {string} uid 
     * @returns Promise({deletedCount, acknowledged})
     */
    function deleteMessage(uid) {
        const query = { _id: ObjectId(uid) };
        return model.USER.deleteOne(query);
    };
    //#endregion

    //#region CHAT
    /*
    Chat object
    {
        _id: ObjectId,
        // is_group only for differ, use getGroup() otherwise 
        members: [ObjectId, ...],
        messages: [ObjectId, ...],
    }   

    Group object
    {
        _id: ObjectId,
        title: String,
        description: String,
        members: [ObjectId, ...],
        messages: [ObjectId, ...],
    }
    */
    /**
     * Retrieve chat and its messages by id from the database 
     * @param {string} uid 
     */
    async function readChat(uid) {
        const chat = await model.CHAT.findOne({ _id: ObjectId(uid) });
        const members = await (model.USER_CHAT.find({ chat: ObjectId(uid) })).toArray();
        return chat.is_group ? await readGroup(uid, chat) : new Chat({ _id: chat._id, members });
    };

    async function readGroup(uid, chat) {
        const query = { _id: ObjectId(uid) };
        const group_db = await model.GROUP.findOne(query);
        return new Group({ _id: group_db._id, title: group_db.title, description: group_db.description, user, messages });
    }

    async function createChat() {

    }

    async function updateChat() {
    }

    async function deleteChat() {
    }

    async function getChatMembers() {
        const query = { _id: ObjectId(uid) };

    }

    async function getChatMessages(uid) {
        const query = { chat: ObjectId(uid) };
        return await model.MESSAGE.find(query);
    };

    async function getUserChats(uid, user) {
        const query = { user: ObjectId(uid) };
        const id_chats = (await model.USER_CHAT.find(query)).toArray();
        return id_chats.map(id_chat => readChat(id_chat, user));
    };

    //#endregion
    //#endregion

    return {
        readUser, createUser, updateUser, deleteUser,
        readMessage, createMessage, updateMessage, deleteMessage,
        readChat, createChat, updateChat, deleteChat,
        getUserChats,
    };
}();

exports.api = api;
