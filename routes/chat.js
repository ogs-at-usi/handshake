// const express = require('express');
// const router = express.Router();
// module.exports = router;
//
// router.get('/chats', async function (req, res) {
//   const chats = await getChats(req.user_id);
//
//   res.json(chats);
// });
//
// router.get('/messages/:chat_id', async function (req, res) {
//
//   const chats = await getChats(req.user_id);
//
//   const valid = chats.some((chat)=>{
//     return chat._id.toString() === req.params.chat_id;
//   });
//
//   if (!valid) res.status(422);
//
//   const messages = await getMessages(req.user_id);
//
//   res.json(messages);
// });
//
// router.get("/users", async function (req, res) {
//
//   const users = await getUsers(req.query.filter);
//
//   res.json(users);
//
// });
//
