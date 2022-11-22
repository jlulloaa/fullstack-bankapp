// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, query, getDocs, where } from "firebase/firestore";
// Enable add/read documents to/from Cloud Firestore (users)
import { getAnalytics } from "firebase/analytics";

// Following the tutorial here to set up firebase and manage persistence:
// https://blog.logrocket.com/user-authentication-firebase-react-apps/
// react-firebase-hooks to manage the authentication state of the user.
import { GoogleAuthProvider, getAuth, deleteUser, // updateProfile,
  // setting persistence:
  setPersistence, browserSessionPersistence, 
  signInWithRedirect as GoogleSignIn,
  //signInWithPopup as GoogleSignIn,
 signInWithEmailAndPassword, createUserWithEmailAndPassword,
 sendPasswordResetEmail, signOut } from "firebase/auth";

import { postNewUser } from '../services/middleware';
 // import { getAuth, createUserWithEmailAndPassword, AuthErrorCodes} from "firebase/auth";
import { AuthErrorCodes, onAuthStateChanged, updateProfile } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase (make sure any other service is loaded AFTER calling initializeApp)
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
// const dbusrs = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
setPersistence(auth, browserSessionPersistence);

// const googlanalytics = getAnalytics(firebaseApp);
// const dbusr = getFirestore();

// Signup with Google Account:
const googleProvider = new GoogleAuthProvider();

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     if (!user.displayName) {
//       updateProfile(auth.currentUser, {
//           displayName: auth.currentUser.name
//       }).then(() => {
//           // Profile updated!
//           // ...
//         }).catch((error) => {
//           // An error occurred
//           // ...
//         });
        
//     }
//     console.log(JSON.stringify(user));
//     postNewUser(user);
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

const signInWithGoogle = async () => {
    await GoogleSignIn(auth, googleProvider)
      .then(() => {
        console.log('Everything allright signing up with google ;) ');
        // return true;    
        // Sends everything to the backend to access banking data. That function also should redirects to the correct frontend view (e.g. accountsummary)
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
        // return false;
      });
};

// Signup with email and password:
const registerWithEmailAndPassword = async (name, email, password) => {
  await createUserWithEmailAndPassword(auth, email, password)
  .then(async () => {
    // Signed in 
    if (!auth.currentUser.displayName) {
      await updateProfile(auth.currentUser, {displayName: name});
      console.log('New user sent to the backend...');
      postNewUser(auth.currentUser);
    }
    console.log(auth.currentUser.displayName);
  })
  .catch((error) => {
    console.log(error.code);
    console.log(error.message);
  });
}

// Signin (existing user) with email and password
const logInWithEmailAndPassword = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then(() => {})
    .catch((err) => {
      console.error(err);
      alert(err.message);
    })
};

// Password reset function:
const sendPasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset link sent!");
    })
    .catch((err) => {
      console.error(err);
      alert(err.message);
    })
};

// Logout function
const logOut = async() => {
  await signOut(auth)
    .then(() => {return true} )
    .catch((error) => {return false} )
};

// const logOut = () => {
//   signOut(auth)
//    .then(()=> {
//       console.log("Successfully logged out")
//       return true
//    })
//    .catch((err)=> {
//       console.log(err)
//       return false
//    });
// };


const removeUser = async() => {
  await deleteUser(auth.currentUser)
    .then(() => {
      // User deleted.
      console.log('User deleted')
    })
    .catch((error) => {
      // An error ocurred
      // ...
    });
  }

// Implementing session duration (https://gist.github.com/jwngr/b751bbc284412958a1e9b02a984571ae)
onAuthStateChanged(auth, (user) => {
  let sessionTimeout = null;
  if (user === null) {
    // User is logged out.
    // Clear the session timeout.
    sessionTimeout && clearTimeout(sessionTimeout);
    sessionTimeout = null;
  } else {
    // User is logged in.
    // Fetch the decoded ID token and create a session timeout which signs the user out.
    user.getIdTokenResult().then((idTokenResult) => {
      // Make sure all the times are in milliseconds!
      const authTime = idTokenResult.claims.auth_time * 1000;
      const sessionDuration = 1000 * parseInt(process.env.REACT_APP_SESSION_TIMEOUT);
      const millisecondsUntilExpiration = sessionDuration - (Date.now() - authTime);
      
      sessionTimeout = setTimeout(() => {
          alert('Session expired, please login again '+ parseInt(process.env.REACT_APP_SESSION_TIMEOUT));
          auth.signOut()}, 
          millisecondsUntilExpiration);
    });
  }
})

export { auth,
  // db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logOut,
  removeUser
};


