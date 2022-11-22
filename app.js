/**
 * Web Atelier 2022  Exercise 7 - Single-Page Web Applications with Fetch and Client-side Views
 *
 * Student: __STUDENT NAME__
 *
 * Main Server Application
 *
 * version 1289 Wed Nov 02 2022 17:01:56 GMT+0100 (Central European Standard Time)
 *
 */






//require framework and middleware dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const methodOverride = require('method-override');
const multer  = require('multer');

const ejsc = require('ejsc-views');

const fs = require('fs-extra');



//init framework
const app = express();



app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(express.json({limit: '4MB'}));    // parse application/json
app.use(multer().none());   //parse multipart/form-data

app.use(express.static(path.join(__dirname, 'public'), {index: "index.html"}));

app.use(methodOverride('_method'));

app.set('view engine', 'html');

ejsc.compile(views_dir = "views", output_dir = "public/js", details = false);

//co

//controllers
const routers = require('./routes');

app.use(routers.home);
app.use('/games', routers.games);
app.use('/high_scores', routers.high_scores);

//default fallback handlers
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  //if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err
      });
    });
  //}

  // production error handler
  // no stacktraces leaked to user
  // app.use(function(err, req, res, next) {
  //   res.status(err.status || 500);
  //   res.json({
  //     message: err.message,
  //     error: {}
  //   });
  // });



//start server
app.set('port', process.env.PORT || 8888);

var server = require('http').createServer(app);

server.on('listening', function() {
  console.log('Express server listening on port ' + server.address().port);
});

server.listen(app.get('port'));


