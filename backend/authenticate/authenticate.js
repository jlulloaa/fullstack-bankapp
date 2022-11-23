// Let's try firebase for firAdmin the backend as well (see https://dev.to/bbarbour/creating-a-mern-stack-app-that-uses-firebase-authentication-part-one-31a7 and https://firebase.google.com/docs/firAdmin/setup)
const firAdmin = require('firebase-admin');

const serviceAccount = require('../config/fir-env.json');

firAdmin.initializeApp({
        credential: firAdmin.credential.cert(serviceAccount)
    });

function verifyToken(req, res, next) {
    try {
      const idToken = req.headers.authorization;
      firAdmin.auth().verifyIdToken(idToken)
        .then(() => {next()})
    } catch (err) {
      console.log('Cannot verify token');
      console.log(`Cannot verify token (${err})`);
      res.send('Authentication error! (' + err + ')');
    }
  }

  module.exports = {verifyToken};
