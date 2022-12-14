// Let's try firebase for firAdmin the backend as well (see https://dev.to/bbarbour/creating-a-mern-stack-app-that-uses-firebase-authentication-part-one-31a7 and https://firebase.google.com/docs/firAdmin/setup)
require('dotenv').config();
const firAdmin = require('firebase-admin');

const serviceAccount = {
  type: process.env.FIREBASE_ADMIN_TYPE,
  project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
  token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
};

firAdmin.initializeApp({
        credential: firAdmin.credential.cert(serviceAccount)
    });


function verifyToken(req, res, next) {
    try {
      const idToken = req.headers.authorization;
      firAdmin.auth().verifyIdToken(idToken)
        .then(function() {next()})
    } catch (err) {
      res.status(401).send('Invalid token');
    }
  }

  module.exports = {verifyToken};
