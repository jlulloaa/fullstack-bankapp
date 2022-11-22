import { useEffect } from 'react';
import Card from './card';
import { Link, Navigate } from 'react-router-dom';
import { ToolTips } from './utils';
// import { useCtx } from './context';
// import { getAuth, signOut } from "firebase/auth";
import {auth, logOut } from './fir-login';
import { useAuthState } from "react-firebase-hooks/auth";

// Rather than using buttons to log in and sign up, use links to these pages and style them as buttons

function Logout() {
    // const { users, setContext } = useCtx();
    // const currState = useCtx();

    // const navigate = useNavigate();
    // navigate('/');
    const handleLogout = async () => {
        await logOut();
    };
    console.log('Logged out');
    
    return ( <>
        { auth.currentUser ? (
            handleLogout
        ) : (
            <Navigate replace to="/login"></Navigate>
        )
        }</>);
    // return (
    //     <Card 
    //         bgcolor="primary"
    //         txtcolor="white"
    //         header="BadBank"
    //         title="Welcome to BadBank"
    //         text="A friendly bank with an excellent website, but poor services"
    //         body={(<div><img src="./bank_logo.png" className="img-fluid" alt="Responsive Site"/>
    //         <span data-tip data-for="noAccountTip">
    //         <Link to="/login" className="btn btn-success" >Login</Link>
    //         </span>
    //         <Link data-tip data-for="createAccTip" to="/createAccount" className="btn btn-warning">Sign up</Link>
    //         <ToolTips></ToolTips>
    //         </div>)}
    //      />
    // );
}

export default Logout;