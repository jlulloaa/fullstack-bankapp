import React , { useEffect, useState } from 'react';
import Card from './card';
// import { useCtx } from './context';
import { useFormik } from 'formik';
import { Navigate } from 'react-router';
import { Link, useNavigate} from 'react-router-dom';
import { ToolTips } from './utils';
// import { getAuth, signInWithEmailAndPassword, AuthErrorCodes, onAuthStateChanged} from "firebase/auth";
import { AuthErrorCodes } from "firebase/auth";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from './fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';

import { LoadingPage } from './utils';

function Login() {

    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const currState = useCtx();
    // const [userLogin, setUserLogin] = useState(false);
    const [btndisabled, setBtnDisabled] = useState(true);
    const [user, loading, error] = useAuthState(auth);
    // const navigate = useNavigate();

    // useEffect(() => {

    //   if (loading) {
    //     // maybe trigger a loading screen
    //     return;
    //   }
    //   if (user) {
    //     // setUserLogin(true);
    //     currState.isActive = true;
    //     console.log(JSON.stringify(user));
    //     // navigate("/accountsummary");
    // } else {
    //     setUserLogin(false);
    //     currState.isActive = false;
    // }
    // }, [user, loading, currState]);

    // Initialize Firebase Authentication and get a reference to the service
    // const auth = getAuth(fbAuth);   
    // const { users, setContext } = useCtx();
    // const currState = useCtx();
    // let isActive = false
    // onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //       // User is signed in, see docs for a list of available properties
    //       // https://firebase.google.com/docs/reference/js/firebase.User
    //       const uid = user.uid;
    //       isActive = true;
    //       // ...
    //     } else {
    //       isActive = false;
    //       // User is signed out
    //       // ...
    //     }
    //   });
    
    // console.log(`Current (initial) State: ${JSON.stringify(currState)}`);
    const loginWithGoogle = async () => {
        // currState.isActive = await signInWithGoogle();
        await signInWithGoogle()
    };
        // if return is true ==> go to the bridge function that connects to the backend (i.e. accountsummary.js?)

    const loginManually = async (userData) => {
        await logInWithEmailAndPassword(userData.email, userData.password);
    };

    const formik = useFormik({
        initialValues: {
            email: "", //currState.user.email,
            password: "", // currState.user.password,
        },
        onSubmit: (values, {resetForm}) => {
            loginManually(values);
            // await logInWithEmailAndPassword(values.email, values.password);
            
                // .then( (userCredentials) => {
                //     // Signed in
                //     const user = userCredentials.user;
                //     console.log(`User local variable: ${JSON.stringify(user)}`);
                //     console.log(`Values upper variable: ${JSON.stringify(values)}`);
                //     console.log(`Local userCredential: ${JSON.stringify(userCredentials)}`);

                //     // alert(`User ${user.email} logged in successfully`)
                //     // currState.user.email = values.email;
                //     // currState.isActive=true;
                //     setUserLogin(true);
                //     resetForm({values:''});
                //     setBtnDisabled(true);
                //     // console.log(`Current State: ${JSON.stringify(currState)}`);
                //     // Shall call the backend with the login details to retrieve the user information ...
                // })
                // .catch( (error) => {
                //     if (error.code === AuthErrorCodes.USER_DELETED) {
                //         alert(`User ${values.email} not registered`)
                //     } else if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
                //         alert('Incorrect password');
                //     }
                //     setUserLogin(false);
                //     console.log(error.message);
                // })
            // console.log(currState.user);
            // setIsLoading(false);
        },
        validate,
    });
    
    function validate (values) {
        let errors = {};
        let disableBtn = false;

        if (!values.email) {
            errors.email = 'Field required';
             disableBtn = true;
       } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Email should be in the correct format';
            disableBtn = true;
            // Adding another branch, check whether email is in users
        } else {            
            // Check whether the email is in the users list (create a simple check function)
            // When a backend is enabled, this check will happen there, so this is not used
            // var findEmailPos = users.findIndex(item => item.email === values.email);
            // console.log(findEmailPos);
            // if (findEmailPos < 0 ) {
            //     errors.email = 'Email is not registered, please create an account first'
            //     disableBtn = true;
            // } else {
            //     // Swap the last element by the one selected by the email:
            //     console.log(users[findEmailPos]);
            //     [users[findEmailPos], users[users.length-1]] = [users[users.length-1], users[findEmailPos]];
            //     console.log(users);
            // }
        }; 
      
        if (!values.password) {
          errors.password = 'Field required';
          disableBtn = true;
        } else if (values.password.length < 8) {
            errors.password = 'Password length must be 8 characters or longer';
            // Adding another branch, check whether password is in ctx
            disableBtn = true;
        };
        
        setBtnDisabled(disableBtn);
        return errors;
    };
    
    return (
        <Card 
            bgcolor="primary"
            txtcolor="white"
            header="BadBank"
            title="ACCESS YOUR ACCOUNT"
            text="Access your restricted area to manage your account"
            body={user ? (
                <Navigate replace to="/accountsummary" >
                </Navigate>
                ) : (
                <>
                { loading ? <LoadingPage /> : <></>}
                <form onSubmit={formik.handleSubmit}>
                    Email address<br/>
                    <input type="input" className="form-control" id="email" placeholder="Enter email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} autoComplete="off"/> {formik.touched.email && formik.errors.email ? (<div id="emailError" style={{color:'red'}}>{formik.errors.email}</div>) : null}<br/>
                    Password<br/>
                    <input type="password" autoComplete="off" className="form-control" id="password" placeholder="Enter password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>{formik.touched.password && formik.errors.password ? (<div id="pswError" style={{color: 'red'}}autoComplete="off">{formik.errors.password}</div>) : null}<br/>
                    <button data-tip data-for="existAccTip" type="submit" className="btn btn-success" disabled={btndisabled}> Login</button>
                    <ToolTips></ToolTips>
                </form> 
                <button className="login__btn login__google" onClick={loginWithGoogle}>
                    Login with Google
                </button>
                <div>
                    <Link to="/reset">Forgot Password</Link>
                </div>
                <div>
                    Don't have an account? <Link to="/createaccount">Register</Link> now.
                </div>
                </>
                )
            }
        />
    );
}


export default Login;