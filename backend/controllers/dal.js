/** Data Abstraction Layer for MongoDB
 * Review this link to check which functions can use on the database
 * https://mongoosejs.com/docs/api/model.html
 * Contains the functions to query the database through the connection provided by conn.js
 */
const { UserSchema } = require('../models/schemas');

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
async function createUser(req, res) {
    // Validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    // Check the user's email is not already used. Return everything in case it already exist, so the function serves two purposes: create or login
    const userData = await UserSchema.find({email: req.body.user.email});
    if (!(userData.length > 0)) {
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
                }]
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
                    message: `${JSON.stringify(err)}` || "Some error occurred when creating the user, please try again"
                });
            });
    } else {
        // Get login access with token
        console.log('Email already exists');
        res.status(500).send({message: 'User already exists'});
    }

    };

/** CREATETRANSACTION
 * 
 */

function createTransaction(req, res) {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
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
    UserSchema.find({email: req.query.email}, 'history')
        .then((docs) => {
            try{
                res.send(docs[0].history);
            } catch {
                res.send(null);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving the data"
            });
        });
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
