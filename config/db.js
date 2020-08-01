const mongoose =require('mongoose');


// //Set Up Mongoose
// mongoose.Promise = Promise;
// const mongoServer1 = new MongoMemoryServer();

// const connections = {
//   conn1: mongoose.createConnection(),
// };
// const mongooseOpts = { // options for mongoose 4.11.3 and above
//   promiseLibrary: Promise,
//   autoReconnect: true,
//   reconnectTries: Number.MAX_VALUE,
//   reconnectInterval: 1000,
// };

// mongoServer1.getUri('server1_db1').then((mongoUri) => {
//   connections.conn1.connect(mongoUri, mongooseOpts);
//   connection.once('open', () => {
//     console.log(`MongoDB successfully connected to ${mongoUri}`);
//   });
// });

autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/CodeJudge");
autoIncrement.initialize(connection);

module.exports = {
    database : 'mongodb://localhost/CodeJudge',
    connection: connection
}