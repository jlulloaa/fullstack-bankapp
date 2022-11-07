/** Just a simple script to test a MongodB database
 *  @author Jose L. Ulloa <jose.ulloa@isandex.com>
 *  To pull up the client, run from docker:
 *  docker run -p 27017:27017 --name badbank -d mongo
 *  to have mongo up and runnint
 * */ 
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';

/** Connect to the database and performs some simple dB operations
 * @param {string} url  - Address where MongoDB is running
 * @param {function} anonymous function - handles the connection and operations performed into the database
 * @return {void} - It certainly is a very bad-shaped function, but is just a testing at this stage
 */
MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
    console.log('Connected!');

    // database Name
    const dbName = 'myproject';
    const db = client.db(dbName);
    console.log(db);

    // new User
    var name = 'user' + Math.floor(Math.random()*1000);
    var email = name + '@ulloa.cl';

    // insert custom table
    var collection = db.collection('customers');
    var doc = {name, email};
    collection.insertOne(doc, {w:1}, function(err, result) {
        console.log('Document insert');
        console.log(db);
    });

    // read data 
    // see https://tpiros.dev/blog/deprecation-warnings-in-mongodbs-node-js-api/ for details about toArray() new syntax
    var customers = db
        .collection('customers')
        .find({})
        .toArray()
        .then((response) => {
            console.log(response);
            // clean up
            client.close();
        })
        .catch((error) => console.error(error)
        );
});
