/** server.js
 * 
 */
// const path    = require('path');
const express = require('express');
const cors    = require('cors');

// Let's try firebase for admin the backend as well (see https://dev.to/bbarbour/creating-a-mern-stack-app-that-uses-firebase-authentication-part-one-31a7 and https://firebase.google.com/docs/admin/setup)
const admin = require('firebase-admin');
const serviceAccount = require('./config/fir-env.json');

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const firebase = initializeApp({
        // credential: applicationDefault(),
        credential: admin.credential.cert(serviceAccount)
    });

const decodeIDToken = require('./authenticate/authenticate');

// Following the MERN tutorial at https://www.mongodb.com/languages/mern-stack-tutorial include dotenv to allow using environment variables
require('dotenv').config({path: './config/config.env'});
const port = process.env.PORT || 3001;

const app     = express();

// Do not use CORS empty when deploying into production!! (e.g. https://stackoverflow.com/questions/66171824/how-to-allow-cors-on-nodejs-backend-application)
// As shown here https://www.bezkoder.com/react-node-express-mongodb-mern-stack/, this is how to use CORS in production:
// var corsOption = {origin: 'http://localhost:8081'};
// app.use(cors(corsOption));
// but for simplicity, during development, just use it empty
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Add listener to the database
app.listen(port, () => {
    // // connects to the database when the server starts
    console.log(`Server is running on port : ${port}`);
    const db      = require('./db/mongodBConn');
});

// Load the routes
app.use(require('./routes/routes'));
app.use(require('./routes/users'));

module.export = { firebase };