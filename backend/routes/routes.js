/** routes.js 
 * Part of the Server API endpoint
 */
const express = require('express');

// Routers is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /.
const Routers = express.Router();

const { verifyToken } = require('../authenticate/authenticate');

// This will provide the CRUD functions to operate in the database
const dbCRUD = require('../controllers/dal');

 /** WELCOME
 * @swagger 
 * /api:
 *  get: 
 *      summary: (callback function is dal.welcome(req, res))
 *      tags:
 *          - welcome
 *      description: Simple "Welcome message" to test the endpoint is up and running
 *      basePath: routes/routes.js
 *      produces:
 *          - application/json
 *      responses:
 *          '200':
 *              description: OK
 *  
 */
Routers.get('/api', dbCRUD.welcome);

/** READALL
 * @swagger
 * /api/readall:
 *  get:
 *      summary: (callback function is dal.readAll(req, res))
 *      tags:
 *          - readAll
 *      description: Read all the transactions history for a given user (see parameters)
 *      parameters:
 *          - in: query
 *            name: email
 *            required: true
 *            description: User's email (login detail)
 *            schema:
 *                type : string
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                application/json:
 *                   schema: 
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties: 
 *                          timestamp: 
 *                            type: string 
 *                            description: Current timestamp
 *                          account_nro: 
 *                            type: string 
 *                            description: Account Nro of the corresponding transaction 
 *                          transaction_amount: 
 *                            type: number
 *                            description: Amount of the transaction
 *                          transfer_from:
 *                            type: string
 *                            description: Email of the source account the transfer comes from (if the transaction was a transfer, otherwise, is null)
 *                          transfer_to:
 *                            type: string
 *                            description: Email of the receptor account where transfer goes to (if the transaction was a transfer, otherwise, is null)
 *                          balance: 
 *                            type: number
 *                            description: Balance in the account after correcting by the amount of the transaction, respect the balance at the previous transaction
 *                          _id: 
 *                            type: string
 *                            description: auto-generated field
 *                   example:
 *                        application/json:
 *                           - timestamp: 2022-11-28T01:29:57.343Z
 *                             account_nro: 202226586047
 *                             transaction_type: transferout
 *                             transaction_amount: 10
 *                             transfer_to: chinita@margarita.com
 *                             balance: 293984
 *                             _id: 63840f16203f0feedcf84c27
 *                           
 */
Routers.get('/api/readall', verifyToken, dbCRUD.readAll);

/** GETEMAILLIST
 * @swagger
 * /api/getallemail:
 *  get:
 *      summary: (callback function is dal.getEmailList(req, res))
 *      tags:
 *          - getEmailList
 *      description: |
 *          Gets all the user's emails so one can be selected in the frontend to transfer money to. The current logged user's email is required to exclude it from the list 
 *      parameters:
 *          - in: query
 *            name: email
 *            required: true
 *            description: User's email (login detail)
 *            schema:
 *                type : string
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                application/json:
 *                   schema: 
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          label: 
 *                            type: string 
 *                            description: email address
 *                          value: 
 *                            type: number 
 *                            description: self-assigned list index 
 *                   example:
 *                        application/json: 
 *                           - label: jose@ulloa.cl
 *                             value: 0
 */
Routers.get('/api/getallemail', verifyToken, dbCRUD.getEmailList);

/** READONE
 * @swagger
 * /api/readone:
 *  get:
 *      summary: (callback function is dal.readOne(req, res))
 *      tags:
 *          - readOne
 *      description: Get latest transaction, based on the email (is unique for the dB users)
 *      parameters:
 *          - in: query
 *            name: email
 *            required: true
 *            description: User's email (login detail)
 *            schema:
 *                type : string
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                application/json:
 *                   schema: 
 *                        type: object
 *                        properties: 
 *                          timestamp: 
 *                            type: string 
 *                            description: Current timestamp
 *                          account_nro: 
 *                            type: string 
 *                            description: Account Nro of the corresponding transaction 
 *                          transaction_type: 
 *                            type: string
 *                            description: can be setup, deposit, withdrawal, transferin or transferout
 *                          transaction_amount: 
 *                            type: number
 *                            description: Amount of the transaction
 *                          transfer_from:
 *                            type: string
 *                            description: Email of the source account the transfer comes from (if the transaction was a transfer, otherwise, is null)
 *                          transfer_to:
 *                            type: string
 *                            description: Email of the receptor account where transfer goes to (if the transaction was a transfer, otherwise, is null)
 *                          balance: 
 *                            type: number
 *                            description: Balance in the account after correcting by the amount of the transaction, respect the balance at the previous transaction
 *                          _id: 
 *                            type: string
 *                            description: auto-generated field
 *                   example:
 *                        application/json: 
 *                           - timestamp: 2022-11-28T01:29:57.343Z
 *                             account_nro: 202226586047
 *                             transaction_type: transferout
 *                             transaction_amount: 10
 *                             transfer_to: chinita@margarita.com
 *                             balance: 293984
 *                             _id: 63840f16203f0feedcf84c27
 */
Routers.get('/api/readone', verifyToken, dbCRUD.readOne); //, verifyToken);

/** CHECKUSER
 * @swagger
 * /api/isuser:
 *  get:
 *      summary: (callback function is dal.checkUser(req, res))
 *      tags:
 *          - checkUser
 *      description: Check whether a user's email is already associated to an account in the backend. Returns a boolean
 *      parameters:
 *          - in: query
 *            name: email
 *            required: true
 *            description: User's email (login detail)
 *            schema:
 *                type : string
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *              type: boolean
*/
Routers.get('/api/isuser', verifyToken, dbCRUD.checkUser);

/** READBANKDETAILS
 * @swagger
 * /api/readbankdetails:
 *  get:
 *      summary: (callback function is dal.readBankDetails(req, res))
 *      tags:
 *          - readBankDetails
 *      description: Retrieves all the bank details (account number and historical transactions) for a given user email
 *      parameters:
 *          - in: query
 *            name: email
 *            required: true
 *            description: User's email (login detail)
 *            schema:
 *                type : string
 *      responses:
 *          '200':
 *              content:
 *                application/json:
 *                   schema: 
 *                        type: object
 *                        properties: 
 *                          _id: 
 *                            type: string
 *                            description: User ID assigned when creating the account by Firebase
 *                          account:
 *                            type: array
 *                            items:
 *                              type: object
 *                              properties:
 *                                account_nro:
 *                                  type: number
 *                                  description: Account Number
 *                                account_type:
 *                                  type: string
 *                                  description: Type of the account (for now, only CURRENT)
 *                          history:
 *                            type: array
 *                            items:
 *                              type: object
 *                              properties:
 *                                timestamp: 
 *                                  type: string 
 *                                  description: Current timestamp
 *                                account_nro: 
 *                                  type: string 
 *                                  description: Account Nro of the corresponding transaction 
 *                                transaction_type: 
 *                                  type: string
 *                                  description: can be setup, deposit, withdrawal, transferin or transferout
 *                                transaction_amount: 
 *                                  type: number
 *                                  description: Amount of the transaction
 *                                transfer_from:
 *                                  type: string
 *                                  description: Email of the source account the transfer comes from (if the transaction was a transfer, otherwise, is null)
 *                                transfer_to:
 *                                  type: string
 *                                  description: Email of the receptor account where transfer goes to (if the transaction was a transfer, otherwise, is null)
 *                                balance: 
 *                                  type: number
 *                                  description: Balance in the account after correcting by the amount of the transaction, respect the balance at the previous transaction
 *                                _id:
 *                                  type: string
 *                                  description: auto-generated field
 *                   example:
 *                        application/json:
 *                           - _id: 638357ef6a1caed78d25000a
 *                             account: 
 *                               account_nro: 202252111221
 *                               account_type: current
 *                             history: 
 *                               timestamp: 2022-11-27T12:28:31.221Z
 *                               account_nro: 202252111221
 *                               transaction_type: setup
 *                               transaction_amount: 0
 *                               balance: 0
 *                               _id: 638357ef6a1caed78d25000b
 */
Routers.get('/api/readbankdetails', verifyToken, dbCRUD.readBankDetails); //, verifyToken)

/** CREATE
 * @swagger
 * /api/create:
 *  post:
 *      summary: (callback function is dal.createUser(req, res))
 *      tags:
 *          - createUser
 *      description: | 
 *                  - Create a new user (see schema UserSchema). 
 *                  - Users creation is handled in Firebase. 
 *                  - Once a user is created there, it is transferred to the backend. 
 *                  - Users can access their accounts with an email/password combination or via a google account, if using the latter, the user can already exists in the backend
 *                  
 *                  This API handles user creation in the backend (not in Firebase). It first checks the user doesn't already exist, in which case, it creates the user by POSTing it
 *      requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                   schema: 
 *                      type: object
 *                      properties: 
 *                        user: 
 *                          type: object
 *                          properties:
 *                            name:
 *                              type: string 
 *                              description: User name
 *                            email:
 *                              type: string 
 *                              description: User's email
 *      responses:
 *          '201':
 *            description: Account created successfully
 */
 Routers.post('/api/create', verifyToken, dbCRUD.createUser);

 /** CREATE
  * @swagger
  * /api/addtransaction:
  *  post:
  *      summary: (callback function is dal.createTransaction(req, res))
  *      tags:
  *          - createTransaction
  *      description: | 
  *          Adds a new transaction that can be deposit, withdrawal or transfer. In the latter case, a counterpart is added from the receipt email. In this case, a secondary search is performed to retrieve the destination account for the transfer. A user can only generate a transfer out.
  *      requestBody:
  *              required: true
  *              content:
  *                  application/json:
  *                     schema:
  *                        type: object
  *                        properties:
  *                          user: 
  *                            type: object
  *                            properties:
  *                              name:
  *                                type: string 
  *                                description: User name
  *                              email:
  *                                type: string 
  *                                description: User's email
  *                          timestamp: 
  *                            type: string 
  *                            description: Current timestamp
  *                          account_nro: 
  *                            type: number 
  *                            description: Account Nro of the corresponding transaction 
  *                          transaction_type: 
  *                            type: string
  *                            description: can be setup, deposit, withdrawal, transferin or transferout
  *                          transaction_amount: 
  *                            type: number
  *                            description: Amount of the transaction
  *                          transfer_to:
  *                            type: string
  *                            description: Email of the receptor account where transfer goes to (if the transaction was a transfer, otherwise, is null)
  *                          transfer_from:
  *                            type: string
  *                            description: Email of the receptor account where transfer goes to (if the transaction was a transfer, otherwise, is null)
  *                          receipt_email:
  *                            type: string 
  *                            description: If a transfer out, this is the destination email where to deposit
  *                          balance: 
  *                            type: number
  *                            description: Balance in the account after correcting by the amount of the transaction, respect the balance at the previous transaction
  *      responses:
  *          '201':
  *            description: Transfer stored successfully
 */
 Routers.post('/api/addtransaction', verifyToken, dbCRUD.createTransaction); //, verifyToken);
 
 // 
Routers.get(/api/)
// Not yet implemented
// Routers.post('/api/delete', dbCRUD.delRecord, verifyToken);
// Routers.post('/api/update', dbCRUD.updateRecord, verifyToken);

//The 404 Route (ALWAYS Keep this as the last route)
Routers.get('*', dbCRUD.notFound);

module.exports = Routers;