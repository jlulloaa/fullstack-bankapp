/** Data Abstraction Layer for MongoDB
 * Review this link to check which functions can use on the database
 * https://mongoosejs.com/docs/api/model.html
 * Contains the functions to query the database through the connection provided by conn.js
 */
const { UserSchema } = require('../models/schemas');

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

/** CREATEUSER
 *  create user account (wrapped into a Promise)
 * @param {name} string - full name 
 * @param {email} string - user email
 * @param {password} string - user password
 * @return {void} no return output
 */
function createUser(req, res) {
    // Validate request
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    // Create new user
    let now = new Date(); // Timestamp defined here

    const newUser = new UserSchema(
        {
            name: req.body.user.name,
            email: req.body.user.email,
            account: [{
                account_nro: 10001,
                account_type: 'current',
            }],
            history: [{
                timestamp: new Date(),
                account_nro: 10001,
                transaction_type: 'setup',
                transaction_amount:0,
                balance:0,
            },
            {
                timestamp: new Date(),
                account_nro: 10001,
                transaction_type: 'deposit',
                transaction_amount:1000,
                balance:1000,

            },
            {
                timestamp: new Date(),
                account_nro: 10001,
                transaction_type: 'withdrawal',
                transaction_amount:500,
                balance:500,

            }
            ]
            // password: req.body.user.uid
            // account_nro: Int(Math.random()*1000
        }
    );
    // Check the user doesn't exist:
    // Make a query using graphQL to get only emails from registered users.
    // Check the newUser.email is not in that list. If it so, then issues an error
    
    // Save New User in the database:
    // const auth = true;
    // if (auth) {
        newUser
            .save()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: `${JSON.stringify(err)}` || "Some error occurred when creating the user, please try again"
                });
            });
        // return res.send('New User added successfully');
    // }
        // return res.status(403).send('Not authorized')
    };

/** CREATETRANSACTION
 * 
 */

function createTransaction(req, res) {
    if (!req.body) {
        console.log('Bye')
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    console.log(`Document ID used as reference for the queries: ${JSON.stringify(req.body.user)}`);
    const newTransaction = { 
        timestamp: req.body.timestamp,
        account_nro: req.body.user.account_nro,
        transaction_type:req.body.transaction_type,
        transaction_amount:req.body.transaction_amount,
        balance: req.body.updated_balance,
    };
    UserSchema.findOneAndUpdate({email: req.body.user.email}, { $push: { history: newTransaction } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: `${err}` || "Some error " 
            });
        });
    // console.log(req);
    // res.status(200).send({message: 'Ready to send data ;)' });
    // Here form the new object to send to the backend
};

/** READONE
 * Get a single User by its ID (not sure I'll use it for the banking app, but the concept will still be useful to get Users)
 * @param {ID} Int - unique Identifier in the database. It is converted in the call (see UserRoutes.route('/User/:id') in routes/Users.js)
 * @return {void} no output returned
 * 
 */
 function readOne(req, res) {
    UserSchema.findOne({email: req.query.email}, 'history')
        .then((doc) => {
            try {
                const lastTransaction = doc.history.at(-1);
                console.log(`From the database ${lastTransaction}`); //[len(doc.history)-1]}`);
                res.send(lastTransaction);
            } catch {
                res.send(null);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Cannot retrieve the User"
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
    // const auth = true;
    // if (auth) {
        UserSchema.find({email: req.query.email}, 'history')
            // .toArray()
            .then((docs) => {
                // resolve(docs);
                console.log(docs);
                try{
                    res.send(docs[0].history);
                } catch {
                    res.send(null);
                }
            })
            .catch((err) => {
                // reject(error);
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving the data"
                });
            });
        // };
    // return res.status(403).send('Not authorized');
    };

/** UPDATEUser
 * 
 */
// function updateUser(req, res) {
//     res.status(200).send({message: "Route not yet implemented"})
// }
/** DELUser
 * 
 */
// function delUser(req, res) {
//     res.status(200).send({message: "Route not yet implemented"})
// }
/** Enable the create and all functions to be accesible outside this script
 */ 
module.exports = {welcome, createUser, readOne , readAll , createTransaction}; //, updateUser, delUser, };
