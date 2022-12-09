// const { VideoConverter } = require('convert-video');

const express = require('express');

const multer = require('multer');
const sharp = require('sharp');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50000000 } }); // 50MB

const { ObjectId } = require('mongodb');
const { saveMessage } = require('../utils/message.utils');

router.post('/image', upload.single('image'), async function (req, res, next) {
    // TODO: change req.body.chatId to whatever the chatId is
    const chatId = req.body.chatId;
    const userId = req.userId;
    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }

    if (!ObjectId.isValid(chatId)) {
        return res.status(400).end();
    }

    const newMessage = await saveMessage(chatId, userId, '', 'IMAGE');

    if (!newMessage) {
        return res.status(404).end();
    }

    const path = './media/images/'+ newMessage._id +'.jpeg';

    await sharp(file.buffer).jpeg({ quality: 50 }).toFile(path);

    res.status(201).json(file);

});

router.post('/video', upload.single('video'), async function (req, res) {
    
});

router.post('/audio', upload.single('audio'), async function (req, res) {
    const title = req.body.title;
    const file = req.file;



    console.log(title);
    console.log(file);
});

router.post('/file', upload.single('file'), async function (req, res) {
    const title = req.body.title;
    const file = req.file;


    console.log(title);
    console.log(file);
});


module.exports = router;
