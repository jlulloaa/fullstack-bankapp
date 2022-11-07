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

// Create a new 
Routers.post('/api/create/:name/:email/:password', dbCRUD.createRecord);

// This section will help you get a single  by id
Routers.get('/api/readone/:id', dbCRUD.readOne);

// Not yet implemented
Routers.get('/api/delete', dbCRUD.delRecord);
Routers.get('/api/update', dbCRUD.updateRecord);

module.exports = Routers;