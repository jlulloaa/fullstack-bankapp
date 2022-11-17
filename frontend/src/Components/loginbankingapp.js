// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Following the tutorial here to set up firebase and manage persistence:
// https://blog.logrocket.com/user-authentication-firebase-react-apps/
// react-firebase-hooks to manage the authentication state of the user.
import { GoogleAuthProvider, getAuth, updateProfile,
  // setting persistence:
  setPersistence, browserSessionPersistence, 
  signInWithRedirect as GoogleSignIn,
  //signInWithPopup as GoogleSignIn,
 signInWithEmailAndPassword, createUserWithEmailAndPassword,
 sendPasswordResetEmail, signOut } from "firebase/auth";

import { getFirestore, addDoc, collection, query, getDocs, where } from "firebase/firestore";

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
const auth = getAuth(firebaseApp);
const googlanalytics = getAnalytics(firebaseApp);
// const dbusr = getFirestore();

// Signup with Google Account:
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const userCredentials = await GoogleSignIn(auth, googleProvider);
    const user = userCredentials.user;
    console.log(`Login with Google, user: ${JSON.stringify(user)}`);
    // Check whether user already exist
    // const q = query(collection(dbusr, "users"), where("uid", "==", user.uid));
    // const docs = await getDocs(q);
    // console.log(`Still within signInWithGoogle script (${JSON.stringify(docs)})`);
    // if (docs.docs.length === 0) {
    //   await addDoc(collection(dbusr, "users"), {
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: "google",
    //     email: user.email,
    //   });
    // }
    // Sends everything to the backend to access banking data. That function also should redirects to the correct frontend view (e.g. accountsummary)
    console.log('Everything allright signing up with google ;) ');
    return true;
  } catch (err) {
    console.error(err);
    alert(err.message);
    return false;
  }
};

// Signup with email and password:
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredentials.user, {displayName: name})
    return true;
      // .then(() => {return true});
      // .then(async () => {
      //   const user = res.user;
      //   await addDoc(collection(dbusr, "users"), {
      //     uid: user.uid,
      //     name: user.displayName,
      //     authProvider: "local",
      //     email: user.email,
      //   })})
      // .catch((err) => console.log(err.message));
    // return true
  } catch (err) {
    console.error(err);
    alert(err.message);
    return false //{error: err.message}
  }
};

// Signin (existing user) with email and password
const logInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredentials.user;

    return true
  } catch (err) {
    console.error(err);
    alert(err.message);
    return false // {error: err.message}
  }
};

// Password reset function:
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Logout function
const logOut = async() => {
  try {
    await signOut(auth)
    return true
  } catch (error) {
    return false
  }
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

export { auth,
  // db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logOut,
  googlanalytics
};


