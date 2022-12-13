const initDB = require('../models');
const app = require('../app');
const serverSocket = require('../serverSocket');
const { PeerServer } = require('peer');

app.set('port', process.env.PORT || 8888);

const server = require('http').createServer(app);
PeerServer({ port: 9000, path: '' });
server.on('listening', function () {
  console.log('Express server listening on port ' + server.address().port);
});

serverSocket.init(server, app.locals.onlineUsers);
initDB();
server.listen(app.get('port'));
