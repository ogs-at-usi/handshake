const mongoose = require('mongoose');
/* EXTERNAL DATABASE SERVER CONNECTION
const mongodb_uri_atlas = 'mongodb+srv://handshake.mnxzbzv.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority';
const fs = require('fs');
const credentials = '../.secret/X509-cert-dbmanager.pem';
const client = new MongoClient(mongodb_uri, {
    sslKey: credentials,
    sslCert: credentials,
    serverApi: ServerApiVersion.v1,
});
*/

async function setupDB() {
  try {
    const {connection} = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    connection.set('maxTimeMS', 15000);
  } catch (err) {
    console.error(err);
  }
}

module.exports = setupDB;
