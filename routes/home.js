const express = require('express');
const router = express.Router();
module.exports = router;
const ObjectID = require('mongodb').ObjectId;
const { UserChat } = require('../models/userChat');
const { ObjectId } = require('mongodb');
const { User } = require('../models/user');
const { Chat } = require('../models/chat');



// router.get('/', async function (req, res) {
//     console.log("GIN1O");
//     res.render('index.html', { user: req.userID });
// });