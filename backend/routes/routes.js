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

// Just a welcome message when starting at '/'
Routers.get('/api', dbCRUD.welcome);

// This section will help you get a list of all the s
Routers.get('/api/readall', dbCRUD.readAll);

// 
Routers.get('/api/getallemail', dbCRUD.getEmailList);

// Create a new user (see UserSchema in schema.js)
Routers.post('/api/create', dbCRUD.createUser);

// Create a new user (see UserSchema in schema.js)
Routers.post('/api/addtransaction', dbCRUD.createTransaction, verifyToken);

// This section will help you get a single  by id
Routers.get('/api/readone', dbCRUD.readOne, verifyToken);

// Check whether the email is already in use:
Routers.get('/api/isuser', dbCRUD.checkUser, verifyToken);

// 
Routers.get('/api/readbankdetails', dbCRUD.readBankDetails, verifyToken);
// 
Routers.get(/api/)
// Not yet implemented
// Routers.post('/api/delete', dbCRUD.delRecord, verifyToken);
// Routers.post('/api/update', dbCRUD.updateRecord, verifyToken);

//The 404 Route (ALWAYS Keep this as the last route)
Routers.get('*', dbCRUD.notFound);

module.exports = Routers;