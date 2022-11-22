// const firebaseAdmin = require('../server');

// This syntax allows to export the callback function 
// module.exports  = async function (req, res, next) {
//   try {
//     const firebaseToken = req.headers.authorization?.split(" ")[1];

//     let firebaseUser;
//     if (firebaseToken) {
//       firebaseUser = await firebaseAdmin.auth.verifyIdToken(firebaseToken);
//     }

//     if (!firebaseUser) {
//       // Unauthorized
//       return res.sendStatus(401);
//     }

//     const usersCollection = req.app.locals.db.collection("user");

//     const user = await usersCollection.findOne({
//       firebaseId: firebaseUser.user_id
//     });

//     if (!user) {
//       // Unauthorized
//       return res.sendStatus(401);
//     }

//     req.user = user;

//     next();
//   } catch (err) {
//     //Unauthorized
//     res.sendStatus(401);
//   }
// };

// authenticateToken.js
// const admin = require('firebase-admin');
// const serviceAccount = require('../config/fir-env.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   // databaseURL: 'https://phone-book-fe436.firebaseio.com',
// });
async function decodeIDToken(req, res, next) {
  const header = req.headers?.authorization;
  if (header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
const idToken = req.headers.authorization.split('Bearer ')[1];
try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }
next();
}
module.exports = decodeIDToken;
