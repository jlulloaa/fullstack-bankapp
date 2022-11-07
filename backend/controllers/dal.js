/** Data Abstraction Layer for MongoDB
 * Review this link to check which functions can use on the database
 * https://mongoosejs.com/docs/api/model.html
 * Contains the functions to query the database through the connection provided by conn.js
 */
const { UserSchema , AccountSchema, TransactionSchema} = require('../models/schemas');

/** This help convert the id from string to ObjectId for the _id.
 */
// const ObjectId = require('mongodb').ObjectId;

/** A good source to learn how to shape the CRUD operations, is the official mongodb tutorials:
// https://www.mongodb.com/developer/languages/javascript/node-connect-mongodb/
// https://www.mongodb.com/developer/languages/javascript/node-crud-tutorial/
 */ 

/** WELCOME
 * Just a simple welcome message usable for multiple purposes
 * @param {void} no input required
 * @return {void} no output returned
 */
function welcome(req, res) {
    res.status(200).send({message: 'Welcome to BadBank API'});
}

/** CREATERECORD 
 *  create user account (wrapped into a Promise)
 * @param {name} string - full name 
 * @param {email} string - user email
 * @param {password} string - user password
 * @return {void} no return output
 */
function createRecord(req, res) {
    console.log(req);
    // Validate request
    if (!req.body.name) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    // Create new user
    const newUser = new UserSchema(
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
            // account_nro: Math.random()*1000
        }
    );    
    // Save New User in the database:
    newUser
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred when creating the user, please try again"
            });
        });
    };

/** READONE
 * Get a single record by its ID (not sure I'll use it for the banking app, but the concept will still be useful to get records)
 * @param {ID} Int - unique Identifier in the database. It is converted in the call (see recordRoutes.route('/record/:id') in routes/records.js)
 * @return {void} no output returned
 * 
 */
 function readOne(req, res) {
    let dbquery = { _id: req.params.id} //ObjectId(req.params.id) }
    UserSchema.findOne(dbquery)
        .then((doc) => {
            res.send(doc);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Cannot retrieve the record"
            });
        });
};
/** READALL
 * list all users (For details about toArray() new syntax see https://tpiros.dev/blog/deprecation-warnings-in-mongodbs-node-js-api/)
 * @param {void} no input argument required
 * @return {void} no output returned
 * 
 * I'm following the best practices of using promises, as suggested by Express documentation https://expressjs.com/en/advanced/best-practice-performance.html#use-promises
 */ 
function readAll(req, res) {
        UserSchema.find({})
            // .toArray()
            .then((docs) => {
                // resolve(docs);
                res.send(docs);
            })
            .catch((error) => {
                // reject(error);
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving the data"
                });
            });
};

/** UPDATERECORD
 * 
 */
function updateRecord(req, res) {
    res.status(200).send({message: "Route not yet implemented"})
}
/** DELRECORD
 * 
 */
function delRecord(req, res) {
    res.status(200).send({message: "Route not yet implemented"})
}
/** Enable the create and all functions to be accesible outside this script
 */ 
module.exports = {welcome, createRecord, readOne, readAll, updateRecord, delRecord};
