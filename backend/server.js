/** server.js
 * 
 */
const path    = require('path');
const express = require('express');
const cors    = require('cors');

// Enable API documentation (Swagger)
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Following the MERN tutorial at https://www.mongodb.com/languages/mern-stack-tutorial include dotenv to allow using environment variables
require('dotenv').config({path: './config/config.env'});
const port = process.env.PORT || 5000;

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

// APIs documentation:
// Get some info from package.json
const { description, version } = require(`${__dirname}/package.json`);  

const swaggerDefinitions = { 
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          description,
          title: 'BadBank Full Stack Application - API Definitions',
          version,
      },
      schemes: ['https'],
  },
  apis: [`${__dirname}/routes/routes.js`, 
  `${__dirname}/controllers/dal.js`,
  `${__dirname}/models/schemas.js`]
};
const swaggerOptions = {
  customSiteTitle: 'BadBank by Jose L. Ulloa',
};

const swaggerSpecs = swaggerJSDoc(swaggerDefinitions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions));
app.get('/api-docs/docs.json', (req, res) => {  
  res.setHeader('Content-Type', 'application/json');  
  res.status(200).json(swaggerSpecs);  
}); 

// Load the routes
app.use(require(`${__dirname}/routes/routes`));

// for building (see https://dev.to/gregpetropoulos/render-deployment-free-tier-of-mern-app-52mk)
if (process.env.NODE_ENV === 'production') {
    //*Set static folder up in production
    app.use(express.static('../frontend/build'));
    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build','index.html')));
  }

// Add listener to the database
app.listen(port, () => {
    // // connects to the database when the server starts
    console.log(`Server is running on port : ${port}`);
    const db      = require('./db/mongodBConn');
});

