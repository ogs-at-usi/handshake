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

const validateUpload = (req, res, next) => {
  const { chatId } = req.body;
  if (!chatId) {
    return res.status(400).send('No chatId provided');
  }
  if (!ObjectId.isValid(chatId)) {
    return res.status(400).send('Invalid chatId');
  }
  if (!req.file) {
    return res.status(400).send('No file provided');
  }
  next();
};

router.post(
  '/image',
  multerUploads.image,
  validateUpload,
  async function (req, res) {
    const userId = req.userId;
    const { chatId } = req.body;

    const newMessage = await saveMessage(
      chatId,
      userId,
      'invalid.jpeg',
      'IMAGE'
    );

    if (!newMessage) {
      return res.status(404).end();
    }

    const path = './media/images/' + newMessage._id + '.jpeg';

    newMessage.content = newMessage._id + '.jpeg';

    await newMessage.save();

    await sharp(req.file.buffer)
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 60 })
      .toFile(path);
    io.to(chatId).emit('messages:create', newMessage);

    res.status(201);
  }
);

router.post(
  '/video',
  multerUploads.video,
  validateUpload,
  async function (req, res, _) {
    const { chatId } = req.body;

    const newMessage = await saveMessage(
      chatId,
      req.userId,
      req.file.filename,
      'VIDEO'
    );

    if (!newMessage) {
      return res.status(404).end();
    }

    io.to(chatId).emit('messages:create', newMessage);

    res.status(201);
  }
);

router.post(
  '/audio',
  multerUploads.audio,
  validateUpload,
  async function (req, res) {
    const { chatId } = req.body;
    const newMessage = await saveMessage(
      chatId,
      req.userId,
      'invalid.mp3',
      'AUDIO'
    );

    if (!newMessage) {
      return res.status(404).end();
    }

    const path = './media/audio/' + newMessage._id + '.mp3';
    const dir = './media/temp';

    await new Promise((resolve, reject) => {
      FluentFfmpeg(req.file.destination + '/' + req.file.filename)
        .audioBitrate(128)
        .toFormat('mp3')
        .on('error', (err) => {
          res.status(500).json(err).end();
          resolve();
        })
        .on('end', () => {
          fs.rm(dir, { recursive: true }, (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        })
        .save(path);
    });

    newMessage.content = newMessage._id + '.mp3';

    await newMessage.save();
    io.to(chatId).emit('messages:create', newMessage);

    res.status(201);
  }
);

router.post(
  '/file',
  multerUploads.file,
  validateUpload,
  async function (req, res) {
    const { chatId } = req.body;

    const newMessage = await saveMessage(
      chatId,
      req.userId,
      req.file.originalname,
      'DOCUMENT'
    );

    if (!newMessage) {
      return res.status(404).end();
    }

    io.to(chatId).emit('messages:create', newMessage);

    res.status(201);
  }
);

module.exports = router;
