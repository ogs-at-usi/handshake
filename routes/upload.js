// const Ffmpeg = require('ffmpeg');
const fs = require('fs')
const Path = require('path');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50000000 } }); // 50MB
const uploadDisk = multer({ dest: "./media/temp", limits: { fileSize: 50000000 } }); // 50MB
const io = require('../serverSocket').io;

const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './media/videos')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Path.extname(file.originalname)) // Appending .jpg
    }
})

const uploadVideo = multer({ storage: videoStorage, limits: { fileSize: 50000000 } }); // 50MB
const uploadFile = multer({ dest: "./media/files", limits: { fileSize: 50000000 } }); // 50MB
const { ObjectId } = require('mongodb');
const { saveMessage } = require('../utils/message.utils');
const FluentFfmpeg = require('fluent-ffmpeg');

router.post('/image', upload.single('image'), async function (req, res, next) {
    console.log(req);
    console.log(req.file);


    // TODO: change req.body.chatID to whatever the chatID is
    const chatID = req.body.chatID;
    console.log(chatID);
    const userId = req.userId;
    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }

    if (!ObjectId.isValid(chatID)) {
        console.log('invalid chat id');
        return res.status(400).end();
    }

    console.log('about to save message');
    const newMessage = await saveMessage(chatID, userId, 'siumfoto', 'IMAGE');
    console.log(newMessage);

    if (!newMessage) {
        console.log('invalid message');
        return res.status(404).end();
    }

    const path = './media/images/' + newMessage._id + '.jpeg';

    newMessage.content = newMessage._id + '.jpeg';

    await newMessage.save();

    await sharp(file.buffer).flatten({ background: '#ffffff' }).jpeg({ quality: 50 }).toFile(path);
    io.to(chatID).emit('messages:create', newMessage);

    res.status(201).json(file);

});

router.post('/video', uploadVideo.single('video'), async function (req, res, next) {
    // TODO: change req.body.chatID to whatever the chatID is
    const chatID = req.body.chatID;
    const userId = req.userId;
    const file = req.file;
    console.log(file);
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }

    if (!ObjectId.isValid(chatID)) {
        return res.status(400).end();
    }

    const newMessage = await saveMessage(chatID, userId, file.filename, 'VIDEO');

    if (!newMessage) {
        return res.status(404).end();
    }

    // const path = './media/videos/' + newMessage._id + '.mp4';
    // const dir = './media/temp';

    // try {
    //     const process = new Ffmpeg(file.path);

    //     process.then(async function (video) {
    //         console.log('The video is ready to be processed');
    //         await video/* .setVideoFormat('mp4') */.save(path, function (error, file) {
    //             console.log('saving video');
    //             if (!error)
    //                 console.log('Video file: ' + file);

    //         });
    //         return video;
    //     }, function (err) {
    //         console.log('Error: ' + err);
    //     }).then((video) => {

    //         fs.rm(dir, { recursive: true }, err => {
    //             if (err) {
    //                 throw err
    //             }
    //             console.log(`${dir} is deleted!`);
    //         });
    //     });
    // } catch (e) {
    //     console.log(e.code);
    //     console.log(e.msg);
    // }


    // const extension = file.originalname.split('.').pop();

    // file.filename += '.' + extension;

    // newMessage.content = file.filename;

    // await newMessage.save();
    io.to(chatID).emit('messages:create', newMessage);

    res.status(201).json(file);
});

router.post('/audio', uploadDisk.single('audio'), async function (req, res, next) {

    // TODO: change req.body.chatID to whatever the chatID is
    const chatID = req.body.chatID;
    const userId = req.userId;
    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }

    if (!ObjectId.isValid(chatID)) {
        return res.status(400).end();
    }

    const newMessage = await saveMessage(chatID, userId, 'siumaudio', 'AUDIO');

    if (!newMessage) {
        return res.status(404).end();
    }


    const path = './media/audio/' + newMessage._id + '.mp3';
    const dir = './media/temp';


    FluentFfmpeg(file.destination + '/' + file.filename)
        .toFormat('mp3')
        .on('error', (err) => {
            console.log('An error occurred: ' + err.message);
        })
        .on('progress', (progress) => {
            // console.log(JSON.stringify(progress));
            console.log('Processing: ' + progress.targetSize + ' KB converted');
        })
        .on('end', () => {
            console.log('Processing finished !');
            fs.rm(dir, { recursive: true }, err => {
                if (err) {
                    throw err
                }
                console.log(`${dir} is deleted!`);
            });
        })
        .save(path);

    newMessage.content = newMessage._id + '.mp3';

    await newMessage.save();
    io.to(chatID).emit('messages:create', newMessage);

    res.status(201).json(file);
});

router.post('/file', uploadFile.single('file'), async function (req, res, next) {

    // TODO: change req.body.chatID to whatever the chatID is
    const chatID = req.body.chatID;
    const userId = req.userId;
    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }
    const extension = req.file.originalname.split('.').pop();

    if (!ObjectId.isValid(chatID)) {
        return res.status(400).end();
    }

    const newMessage = await saveMessage(chatID, userId, file.filename + '.' + extension, 'DOCUMENT');

    if (!newMessage) {
        return res.status(404).end();
    }

    // const path = './media/files/' + newMessage._id + "." + extension;

    // newMessage.content = file.filename + '.' + extension;

    // await newMessage.save();
    io.to(chatID).emit('messages:create', newMessage);

    res.status(201).json(file);
});


module.exports = router;
