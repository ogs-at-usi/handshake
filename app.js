// require framework and middleware dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const { authenticate } = require('./middlewares/authentication.middleware');
// const multer = require('multer');

require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false })); // parse application/x-www.js-form-urlencoded
app.use(express.json({ limit: '4MB' })); // parse application/json
app.use(cookieParser());
// app.use(multer().none());

app.use(
  express.static(path.join(__dirname, 'public'), { index: 'index.html' })
);
app.use('/media', express.static(path.join(__dirname, 'media')));

app.set('view engine', 'html');

// TODO - controllers
app.use('/auth', require('./routes/auth'));
app.use('/api', authenticate, require('./routes/chat'));
app.use('/upload', authenticate, require('./routes/upload'));

// serve Vue app if no matching route is found
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.locals.onlineUsers = new Set();

module.exports = app;
