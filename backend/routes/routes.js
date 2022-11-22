/** routes.js 
 * Part of the Server API endpoint
 */
const express = require('express');

// Routers is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /.
const Routers = express.Router();
 
// This will help us connect to the database
// const dbo = require('../db/conn');
// This will provide the CRUD functions to operate in the database
const dbCRUD = require('../controllers/dal');

// Just a welcome message when starting at '/'
Routers.get('/api', dbCRUD.welcome);

// This section will help you get a list of all the s
Routers.get('/api/readall', dbCRUD.readAll);

// Create a new user (see UserSchema in schema.js)
Routers.post('/api/create', dbCRUD.createUser);

// Create a new user (see UserSchema in schema.js)
Routers.post('/api/addtransaction', dbCRUD.createTransaction);

// This section will help you get a single  by id
Routers.get('/api/readone', dbCRUD.readOne);

// Not yet implemented
// Routers.post('/api/delete', dbCRUD.delRecord);
// Routers.post('/api/update', dbCRUD.updateRecord);

module.exports = Routers;