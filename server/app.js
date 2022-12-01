// require framework and middleware dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const multer = require('multer');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const initDB = require('./models');
const serverSocket = require('./serverSocket');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json({ limit: '4MB' })); // parse application/json
app.use(multer().none()); // parse multipart/form-data
app.use(cookieParser());

app.use(
  express.static(path.join(__dirname, 'public'), { index: 'index.html' })
);

app.set('view engine', 'html');

// TODO - controllers
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/chat'));

// serve Vue app if no matching route is found
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// start server
app.set('port', process.env.PORT || 8888);

const server = require('http').createServer(app);

server.on('listening', function () {
  console.log('Express server listening on port ' + server.address().port);
});

// TODO websocket server
// eslint-disable-next-line no-undef
serverSocket.init(server);
initDB();
server.listen(app.get('port'));
