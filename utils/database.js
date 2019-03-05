// const mongodb = require('mongodb');
// const MongoClient  = mongodb.MongoClient;

// const { mongoKey } = require('../config/keys');

// let _db;

// const mongoConnect = callback => {

//     // connect() : Based on Promise 
//     // test =>  shop : @firstatlas-drwhc.mongodb.net/test? 
//     MongoClient.connect(`mongodb+srv://joon:${mongoKey}@firstatlas-drwhc.mongodb.net/shop?retryWrites=true`, { useNewUrlParser: true } ).then(client => {
//         console.log('Connected to Mongo~~~');
//         // find 'shop' database and connect client to that db.
//         // Once the connection starts, it will stay connected.
//         _db = client.db();
//         callback();
//     }).catch(e => console.log(e));

// };

// // to check up frequently the client connection to db.
// const getDb = () =>{
//     if(_db) {
//         return _db;
//     }
//     throw new Error('Unable to connect to DB. ');
// }

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;