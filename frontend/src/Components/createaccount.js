import React, { useEffect, useState } from 'react';
import Card from './card';
// import { useCtx } from './context';
import { useFormik } from 'formik';
import { Navigate } from 'react-router';
import { ToolTips } from './utils';
import { Link } from 'react-router-dom';
// import { getAuth, createUserWithEmailAndPassword, AuthErrorCodes} from "firebase/auth";
import { AuthErrorCodes } from "firebase/auth";
import { auth, registerWithEmailAndPassword, signInWithGoogle } from './loginbankingapp';
import { useAuthState } from "react-firebase-hooks/auth";
import { LoadingPage } from './utils';

// Create another function to create the user in the backend, keep things separated
// import axios from 'axios';

function CreateAccount() {
   
    // const [userLogin, setUserLogin] = React.useState(false);
    const [btndisabled, setBtnDisabled] = React.useState(true);
    const [user, loading, error] = useAuthState(auth);
    // const currState = useCtx();

    // const url = `${process.env.REACT_APP_API_URL}/create`;

    // const [user, loading, error] = useAuthState(auth);
    // useEffect(() => {
    //     if (user){
    //         // history.replace("/dashboard");
    //         // setAccess(true);
    //         currState.isActive=true;
    //         console.log(JSON.stringify(user));
    //     } else {
    //         setUserLogin(false);
    //         currState.isActive = false;
    //     }
    //     }, [user, loading, currState]);
        
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            name: '',
        },
        onSubmit: async (values, {resetForm}) => {
            // let now = new Date();
            // Move the alert inside the fetch/axios as part of the response
            // alert('Account created successfully', null, 2);
            // const newUser = {
            //     name: values.name, 
            //     email: values.email, 
            //     password: values.password,
            //     history: [{
            //         withdraw: '',
            //         deposit: '',
            //         date: now.toLocaleDateString('en-GB'),
            //         time: now.toTimeString(),
            //         balance: 1000
            //     }]
            // };
            // Send data to Firebase to handle account creation (here is checks for email existence)    
            await registerWithEmailAndPassword(values.name, values.email, values.password)

            // setUserLogin(true);
            // if (currState.isActive.error) {
                // console.log(res.error);
                // currState.isActive = false;
                // setUserLogin(false);
            // };
                // .then((userCredentials) => {
                //     // Signed in 
                //     const user = userCredentials.user;
                //     console.log(`User local variable: ${JSON.stringify(user)}`);
                //     console.log(`NewUser upper variable: ${JSON.stringify(newUser)}`);
                //     console.log(`Local userCredential: ${JSON.stringify(userCredentials)}`);
                //     setUserLogin(true);
                //     resetForm({values: ''});
                //     setBtnDisabled(true);

                //     // call backend create user...
                //     // axios
                //     // .post(url, userCredentials)
                //     // .then(() => {
                //     //     console.log('New Account Created');
                //     //     alert('Account created successfully', null, 2);
                //     //     setAccess(true);
                //     //     resetForm({values:''});
                //     //     // isActive = true;
                //     // })
                //     // .catch(err => {
                //     //   console.error(err);
                //     // });
                // })
                // .catch((error) => {
                //     if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
                //         alert(`Email ${values.email} is already in use`);
                //     }
                //     console.log(error.message);
                //     // ..
                // });
                         
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
        };
      
        if (!values.name) {
            errors.name = 'Field required';
            disableBtn = true;
        };

        // if (!values.username) {
        //     errors.username = 'Field required';
        //     disableBtn = true;
        // };

        if (!values.password) {
          errors.password = 'Field required';
          disableBtn = true;
        } else if (values.password.length < 8) {
            errors.password = 'Password length must be 8 characters or longer';
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
            title="CREATE A NEW ACCOUNT"
            text= "Register here to start enjoying the benefits of BadBank" 
            body={auth.currentUser ? (
                <Navigate to="/accountsummary"></Navigate>
                ) : (
                <>
                    { loading ? <LoadingPage /> : <></>}
                    <form onSubmit={formik.handleSubmit}>
                        Name<br/>
                        <input type="input" autoComplete="off" className="form-control" id="name" placeholder="Enter your name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/> {formik.touched.name && formik.errors.name ? (<div id="nameError" style={{color:'red'}}>{formik.errors.name}</div>) : null}<br/>
                        {/* Username<br/>
                        <input type="input" autoComplete="username" className="form-control" id="username" placeholder="Enter username" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}/> {formik.touched.username && formik.errors.username ? (<div id="nameError" style={{color:'red'}}>{formik.errors.username}</div>) : null}<br/> */}
                        
                        Email address<br/>
                        <input type="input" className="form-control" id="email" placeholder="Enter your email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}/> {formik.touched.email && formik.errors.email ? (<div id="emailError" style={{color:'red'}}>{formik.errors.email}</div>) : null}<br/>
                        Password<br/>
                        <input type="password" autoComplete="off" className="form-control" id="password" placeholder="Enter a password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>{formik.touched.password && formik.errors.password ? (<div id="pswError" style={{color: 'red'}}>{formik.errors.password}</div>) : null}<br/>
                        <button data-tip data-for="newAccTip" type="submit" className="btn btn-success" disabled={btndisabled}> Create Account</button>
                        <ToolTips></ToolTips>
                    </form>
                    <button className="register__btn register__google" onClick={signInWithGoogle}>
                        Register with Google
                    </button>
                    <div>
                        Already have an account? <Link to="/login">Login</Link> now.
                    </div>                    
                </>
                )
            }
        />
    );
}

export default CreateAccount;