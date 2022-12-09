const Ffmpeg = require('ffmpeg');
const fs = require('fs')
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50000000 } }); // 50MB
const uploadVideoDisk = multer({ dest: "./media/temp", limits: { fileSize: 50000000 } }); // 50MB
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

    const path = './media/images/' + newMessage._id + '.jpeg';

    newMessage.content = newMessage._id + '.jpeg';

    await newMessage.save();

    await sharp(file.buffer).jpeg({ quality: 50 }).toFile(path);

    res.status(201).json(file);

});

router.post('/video', uploadVideoDisk.single('video'), async function (req, res, next) {
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

    const newMessage = await saveMessage(chatId, userId, '', 'VIDEO');

    if (!newMessage) {
        return res.status(404).end();
    }

    const path = './media/videos/' + newMessage._id + '.mp4';
    const dir = './media/temp';

    try {
        const process = new Ffmpeg(file.path);
        process.then(function (video) {
            console.log('The video is ready to be processed');
            video.setVideoFormat('mp4').save(path, function (error, file) {
                if (!error)
                    console.log('Video file: ' + file);
                
            });
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }

    fs.rmdir(dir, { recursive: true }, err => {
        if (err) {
            throw err
        }

        console.log(`${dir} is deleted!`)
    });

    res.status(201).json(file);
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
