/** index.js
 * Handles the connection to the database using Mongoose
 * It can be modified, or can have many files to use different database engines
 * I followed this tutorial
 * https://www.bezkoder.com/node-express-mongodb-crud-rest-api/ 
 * As a first version, will use MongoDB
 * 
 */
 const mongoose = require('mongoose');
 mongoose.Promise = global.Promise;
 
 const db = {};

 db.mongoose = mongoose;
 db.uri = process.env.MONGOOSE_URI + process.env.DBNAME + '?retryWrites=true&w=majority';

 db.mongoose
    .connect(db.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to the database!');
    })
    .catch(err => {
        console.log('Cannot connect to the database!', err);
        process.exit();
    });
// alternatively, can use aync/await format:
// main().catch(err => console.log(err));
// async function main() {
//     await dbo.mongoose.connect(dbo.url);
//     console.log('Connected to database!');
// }

module.exports = db;
