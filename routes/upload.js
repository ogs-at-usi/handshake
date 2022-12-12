// const Ffmpeg = require('ffmpeg');
const fs = require('fs');
const Path = require('path');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();
const io = require('../serverSocket').io;

const { ObjectId } = require('mongodb');
const { saveMessage } = require('../utils/message.utils');
const FluentFfmpeg = require('fluent-ffmpeg');

const MB = 1000 * 1000;
const MAX_SIZES = Object.freeze({
  image: 10 * MB,
  video: 50 * MB,
  audio: 50 * MB,
  file: 50 * MB,
});

const REQUEST_FILE_NAMES = Object.freeze({
  image: 'image',
  video: 'video',
  audio: 'audio',
  file: 'file',
});

const memoryStorage = multer.memoryStorage();
const diskStorage = (subdir, newNameFunc) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './media/' + subdir);
    },
    filename: (req, file, cb) => {
      const name = newNameFunc ? newNameFunc(file, req) : file.originalname;
      cb(null, name);
    },
  });

const multerUploads = Object.freeze({
  temp: multer({ storage: diskStorage('temp') }).single('file'),

  image: multer(
    { storage: memoryStorage },
    { limits: { fileSize: MAX_SIZES.image } }
  ).single(REQUEST_FILE_NAMES.image),

  video: multer({
    storage: diskStorage(
      'videos',
      (file) => Date.now() + Path.extname(file.originalname)
    ),
  }).single(REQUEST_FILE_NAMES.video),

  audio: multer(
    {
      storage: diskStorage('temp'),
    },
    { limits: { fileSize: MAX_SIZES.audio } }
  ).single(REQUEST_FILE_NAMES.audio),

  file: multer(
    { storage: diskStorage('files') },
    {
      limits: { fileSize: MAX_SIZES.file },
    }
  ).single(REQUEST_FILE_NAMES.file),
});

router.post('/image', multerUploads.image, async function (req, res, next) {
  const chatID = req.body.chatID;
  const userId = req.userId;
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }

  if (!ObjectId.isValid(chatID)) {
    return res.status(400).end();
  }

  const newMessage = await saveMessage(chatID, userId, 'siumfoto', 'IMAGE');

  if (!newMessage) {
    return res.status(404).end();
  }

  const path = './media/images/' + newMessage._id + '.jpeg';

  newMessage.content = newMessage._id + '.jpeg';

  await newMessage.save();

  await sharp(file.buffer)
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 50 })
    .toFile(path);
  io.to(chatID).emit('messages:create', newMessage);

  res.status(201).json(file);
});

router.post('/video', multerUploads.video, async function (req, res, next) {
  // TODO: change req.body.chatID to whatever the chatID is
  const chatID = req.body.chatID;
  const userId = req.userId;
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
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

router.post('/audio', multerUploads.audio, async function (req, res, next) {
  // TODO: change req.body.chatID to whatever the chatID is
  const chatID = req.body.chatID;
  const userId = req.userId;
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
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
    .audioBitrate(128)
    .toFormat('mp3')
    .on('error', (err) => {
      res.status(500).json(err).end();
    })
    .on('end', () => {
      fs.rm(dir, { recursive: true }, (err) => {
        if (err) {
          throw err;
        }
      });
    })
    .save(path);

  newMessage.content = newMessage._id + '.mp3';

  await newMessage.save();
  io.to(chatID).emit('messages:create', newMessage);

  res.status(201).json(file);
});

router.post('/file', multerUploads.file, async function (req, res, next) {
  // TODO: change req.body.chatID to whatever the chatID is
  const chatID = req.body.chatID;
  const userId = req.userId;
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }

  if (!ObjectId.isValid(chatID)) {
    return res.status(400).end();
  }

  const newMessage = await saveMessage(
    chatID,
    userId,
    req.file.originalname,
    'DOCUMENT'
  );

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
