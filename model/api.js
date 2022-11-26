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
    function getUser(uid) {
        const query = { _id: ObjectId(uid) };
        return model.USER.findOne(query);
    };

    /**
     * Add a user to the database
     * @param {User} user
     * @returns Promise({acknowledged, insertedId})
     */
    function addUser({ name, password, email }) {
        const user = { name, password, email };
        return model.USER.insertOne(user);
    };

    /**
     * Update a user in the database
     * @param {string} uid 
     * @param {User} user 
     * @returns Promise({matchedCount, modifiedCount, upsertedId, acknowledged})
     */
    function updateMessage(uid, { name, password, email }) {
        const query = { _id: ObjectId(uid) };
        const update = { $set: { name, password, email } };
        return model.USER.updateOne(query, update);
    };

    /**
     * Delete a user from the database
     * @param {string} uid 
     * @returns Promise({deletedCount, acknowledged})
     */
    function deleteMessage(uid) {
        const query = { _id: ObjectId(uid) };
        return model.USER.deleteOne(query);
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
    function getMessage(uid) {
        const query = { _id: ObjectId(uid) };
        return model.MESSAGE.findOne(query);
    };

    /**
     * Add a message to the database
     * @param {Message} message
     * @returns Promise({acknowledged, insertedId}) of add ack message
     */
    function addMessage({ sender, chat, type, content, sent_at, delivered_at, seen }) {
        const message = { sender, chat, type, content, sent_at, delivered_at, seen };
        return model.USER.insertOne(message);
    };

    /**
     * Update a message in the database. NOT USED FOR NOW.
     * @param {string} uid 
     * @param {Message} message 
     * @returns Promise({matchedCount, modifiedCount, upsertedId, acknowledged})
     */
    function updateMessage(uid, { sender, chat, type, content, sent_at, delivered_at, seen }) {
        const query = { _id: ObjectId(uid) };
        const update = { $set: { sender, chat, type, content, sent_at, delivered_at, seen } };
        return model.USER.updateOne(query, update);
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
    async function getChat(uid) {
        const query = { _id: ObjectId(uid) };
        const chat = await model.CHAT.find
        //return model.CHAT.findOne(query
    };

    //#endregion

    function getUserChats(uid_user) {
        const query = { user: ObjectId(uid) };
        return model.USER_CHAT.find(query);
    }
    //#endregion

    return {
        getUser, addUser, updateUser: updateMessage, deleteUser: deleteMessage,
        getMessage, addMessage, updateMessage, deleteMessage,
        getChat,
        getChats,
    };
}();

exports.api = api;
