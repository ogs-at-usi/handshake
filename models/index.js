const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const mongodb_uri = 'mongodb://localhost:27017/handshake';
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
        await mongoose.connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
        console.error(err);
    };
};

module.exports = setupDB;
