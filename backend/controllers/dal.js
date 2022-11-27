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
    res.status(200).send('Welcome to BadBank API');
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
        const account_nro = now.getFullYear()*1e8 + parseInt(now.getTime().toString().slice(-8));
        // console.log(account_nro);
        const newUser = new UserSchema(
            {
                name: req.body.user.name,
                email: req.body.user.email,
                account: [{
                    account_nro: account_nro,
                    account_type: 'current',
                }],
                history: [{
                    timestamp: new Date(),
                    account_nro: account_nro,
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

/** CHECKUSER
 * 
 */

async function checkUser(req, res) {
    await UserSchema.find({email: req.query.email}, 'email')
        .then ((doc) => {
            // console.log(res);
            if (doc.length > 0) {
                res.status(200).send(true);
            } else {
                res.status(200).send(false);
            }
        })
        .catch((err) => {
            console.log(`CheckUser error: ${err}`);
        })
}
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
        transfer_to: req.body.receipt_email,
        balance: req.body.updated_balance,
    };
    let proceed = true;
    if (newTransaction.transaction_type === 'transferout') {
        // Update deposit into receipt user
        UserSchema.findOne({email: req.body.receipt_email}, 'history account')
            .then((doc) => {
                try {
                    console.log(`Receipt is ${req.body.receipt_email}`);
                    const receiptTransfer = {timestamp: newTransaction.timestamp,
                                             transaction_type: 'transferin',
                                             transfer_from: req.body.user.email,
                                             account_nro: doc.account.account_nro,
                                             transaction_amount: newTransaction.transaction_amount,
                                             balance: doc.history.at(-1).balance + newTransaction.transaction_amount
                                            };
                    UserSchema.updateOne({email: req.body.receipt_email}, {$push: {history: receiptTransfer}})
                        .then(() => {return true})
                        .catch(err => {return false})
                    proceed = true
                    }
                catch {
                    proceed = false;
                }
            })
            .catch (err => {
                res.status(500).send({message: `Cannot deposit in the receipt account (${err})`});
                proceed = false;
            })
        }
    if (proceed) {
        UserSchema.findOneAndUpdate({email: req.body.user.email}, { $push: { history: newTransaction } })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: `${err}` || "Some error " 
                });
            });
        }
    }

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
                message: err.message || "Some error occurred while retrieving historical transactions"
            });
        });
};

function readBankDetails(req, res) {
    UserSchema.find({email: req.query.email}, 'account history')
        .then((docs) => {
            try {
                res.send(docs[0]);
            } catch {
                res.send(null);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving bank details"
            })
        })
}

/**
 * Get Email List
 * @param {*} req 
 * @param {*} res 
 */
function getEmailList(req, res) {
    UserSchema.find({ email: {$ne: req.query.email}}, 'email')
        .select( 'email' )
        .exec(function(err, docs){
            docs = docs.map(function(doc, idx) { 
                return {label: doc.email, value: idx}; 
            });
            if(err){
                res.json(err)
            } else {
                res.json(docs)
            }
        })
}
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
/** Not found page */

function notFound(req, res){
    res.status(404).send('Route requested is not valid');
  }

module.exports = {welcome, createUser, checkUser, readOne , readAll , getEmailList, createTransaction, notFound, readBankDetails}; //, updateUser, delUser, };
