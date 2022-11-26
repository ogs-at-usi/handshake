// class Message {

//     static TEXT = 'text';
//     static AUDIO = 'audio';
//     static IMAGE = 'image';
//     static VIDEO = 'video';
//     static DOCUMENT = 'document';
//     static LOCATION = 'location';
//     static GAME = 'game';

//     static CONTENT = function () {
//         const get_content = {};
//         get_content[TEXT] = msg => { return msg.content; };
//         get_content[AUDIO] = msg => { return null; };
//         get_content[IMAGE] = msg => { return null; };
//         get_content[VIDEO] = msg => { return null; };
//         get_content[DOCUMENT] = msg => { return null; };
//         get_content[LOCATION] = msg => { return null; };
//         get_content[GAME] = msg => { return null; };
//         return get_content;
//     }();

//     #_id;
//     #sender;  // given at start
//     #chat;   // given at start
//     #type;
//     #content = null;
//     #sent_at = null;
//     #delivered_at = null;
//     #seen = [];

//     constructor({ _id, sender, chat, type, content, sent_at, delivered_at, read_at }) {
//         this._id = _id;
//         this.sender = sender;
//         this.chat = chat;
//         this.type = type;
//         this.content = content;
//         this.sent_at = sent_at;
//         this.delivered_at = delivered_at;
//         this.read_at = read_at;
//     };

//     get sender() {
//         //TODO: change to iterate instead of the db, on the chat members 
//         if (!(this.#sender instanceof User))
//             this.#sender = getUser(this.#sender);
//         return this.#sender;
//     };

//     get chat() { return this.#chat; };
//     get type() { return this.#type; };

//     get content() {
//         if (this.#content === null)
//             this.#content = Message.CONTENT[this.#type](this);
//         return this.#content;
//     };

//     get sent_at() { return this.#sent_at; };
//     get delivered_at() { return this.#delivered_at; };

//     get seen() {
//         //TODO: change to iterate instead of the db, on the chat members 
//         if (this.#seen.length > 0 && !(this.#seen[0] instanceof User))
//             this.#seen = this.#seen.map(uid => getUser(uid));
//         return this.#seen;
//     };
// };
