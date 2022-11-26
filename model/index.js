const { MongoClient, ServerApiVersion } = require('mongodb');
//const mongoose = require('mongoose'); feature
const mongodb_uri = 'mongodb://localhost:27017';
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
//mongoose.connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true });
//const db = mongoose.connection;
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const client = new MongoClient(mongodb_uri);
const db_name = 'handshake';
const collection_names = ['USER', 'MESSAGE', 'MESSAGE_SEEN', 'CHAT', 'GROUP', 'USER_CHAT', 'REFRESH_TOKEN'];
const model = {};

console.log("Connecting to MongoDB...");
try {
    const connected_client = await client.connect();
    console.log("Connected to MongoDB");
    model.db = connected_client.db(db_name);
    collection_names.forEach(c => model[c] = model.db.collection(c));
} catch (err) {
    console.error(err);
    await client.close();
};

exports.model = model;
exports.ObjectId = mongodb.ObjectId;
