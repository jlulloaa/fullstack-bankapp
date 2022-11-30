// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Following the tutorial here to set up firebase and manage persistence:
// https://blog.logrocket.com/user-authentication-firebase-react-apps/
// react-firebase-hooks to manage the authentication state of the user.
import { GoogleAuthProvider, getAuth, deleteUser,
  // setting persistence:
  setPersistence, browserSessionPersistence, 
  // signInWithRedirect as GoogleSignIn,
  signInWithPopup as GoogleSignIn,
 signInWithEmailAndPassword, createUserWithEmailAndPassword,
 sendPasswordResetEmail, signOut } from "firebase/auth";

import { postUser } from './middleware';
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import Swal from 'sweetalert2'

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
const auth = getAuth(firebaseApp);
setPersistence(auth, browserSessionPersistence);

// Signup with Google Account:
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    await GoogleSignIn(auth, googleProvider)
      .then((result) => {
        console.log('Everything allright signing up with google ;) ');
        // Sends everything to the backend to access banking data. That function also should redirects to the correct frontend view (e.g. accountsummary)
        postUser(result.user);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Cannot Sign you in',
          text: 'Please try again',
          footer: "<a href='/'>Don't have an account? Click to register</a>"
        })
      });
};

// Signup with email and password:
const registerWithEmailAndPassword = async (name, email, password) => {
  await createUserWithEmailAndPassword(auth, email, password)
  .then(async () => {
    // Signed in 
    if (!auth.currentUser.displayName) {
      await updateProfile(auth.currentUser, {displayName: name});
      postUser(auth.currentUser)
    } else {
      // Don't have to wait for updateProfile
      postUser(auth.currentUser)
    }
    Swal.fire({
      icon: 'success',
      title: 'Congratulations!',
      text: 'Welcome to BadBank',
      footer: ''
    })
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'User already registered',
      text: 'Please Login',
      footer: "<a href='/login'>Click to login</a>"
    })
    // console.log(`RegisterWithEmailAndPassword error (code:message) ${error.code}:${error.message}`);
  });
}

// Signin (existing user) with email and password
const logInWithEmailAndPassword = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then(async () => {
      postUser(auth.currentUser);//, 'EandP');
    })
    .catch((err) => {
      console.error(`LogInWithEmailAndPassword error: ${err}`);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'email/password incorrect!',
        footer: "<a href='/'> Don't have an account? Click to register</a>"
      })
    })
};

// Password reset function:
const sendPasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset link sent!");
    })
    .catch((err) => {
      console.error(`SendPasswordReset error: ${err}`);
      alert(err.message);
    })
};

// Logout function
const logOut = async() => {
  await signOut(auth)
    .then(() => {return true} )
    .catch((error) => {return false} )
};


const removeUser = async() => {
  await deleteUser(auth.currentUser)
    .then(() => {
      console.log('User deleted')
    })
    .catch((err) => {
      console.log(`RemoveUser error: ${err}`);
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
          Swal.fire({
            icon: 'error',
            title: 'Session expired',
            text: 'Please login again',
            footer: `Timeout is set to ${parseInt(process.env.REACT_APP_SESSION_TIMEOUT)/60}min`
          })  
          auth.signOut()}, 
          millisecondsUntilExpiration);
    });
  }
})

export { auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logOut,
  removeUser
};


