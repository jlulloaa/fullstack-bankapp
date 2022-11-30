import React from 'react';
import Card from './card';
import { useFormik } from 'formik';
import { Navigate } from 'react-router';
import { ToolTips, Header } from '../utils/tools';
import { Link } from 'react-router-dom';
import { auth, registerWithEmailAndPassword, signInWithGoogle } from '../utils/fir-login';
import { useAuthState } from "react-firebase-hooks/auth";
import { LoadingPage } from '../utils/tools';
import { GoogleLoginButton } from "react-social-login-buttons";

function CreateAccount() {
   
    const [btndisabled, setBtnDisabled] = React.useState(true);
    const [user, loading,] = useAuthState(auth);
    
    const loginWithGoogle = () => {
     signInWithGoogle();
    };
    const registerNewUser = async (userData) => {
        await registerWithEmailAndPassword(userData.name, userData.email, userData.password);
    };
    
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            name: '',
        },
        onSubmit: (values, {resetForm}) => {
            // Send data to Firebase to handle account creation (here is checks for email existence)
            registerNewUser(values);                        
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
            header=<Header/>
            title="CREATE A NEW ACCOUNT"
            text= "Register here to start enjoying the benefits of BadBank" 
            body={user ? (
                <Navigate replace to="/accountsummary"></Navigate>
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
                    <hr/>
                        <GoogleLoginButton onClick={loginWithGoogle} />
                    <div>
                        <br/>
                        <Link to="/login" className="btn btn-outline-success" >Already have an account? <br/>Login now</Link>
                    </div>                    
                </>
                )
            }
        />
    );
}

export default CreateAccount;