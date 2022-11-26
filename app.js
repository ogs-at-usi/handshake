// require framework and middleware dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const multer = require('multer');
const ejsc = require('ejsc-views');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json({ limit: '4MB' })); // parse application/json
app.use(multer().none()); // parse multipart/form-data
app.use(cookieParser())

app.use(
  express.static(path.join(__dirname, 'public'), { index: 'index.html' })
);

app.set('view engine', 'html');

ejsc.compile('views', 'public/js', false);

// TODO - controllers
app.use('/auth', require('./routes/auth'));

// TODO - add routes here

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, _) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

// start server
app.set('port', process.env.PORT || 8888);

const server = require('http').createServer(app);

server.on('listening', function () {
  console.log('Express server listening on port ' + server.address().port);
});

// TODO websocket server

initDB();
server.listen(app.get('port'));
