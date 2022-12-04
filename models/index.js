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
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅Connected to database');
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  }
}
module.exports = setupDB;
