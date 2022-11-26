import { useEffect, useState} from 'react';
import Card from './card';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ToolTips } from './utils';
// import { useCtx } from './context';
// import { getAuth, signOut } from "firebase/auth";
import {auth, logOut } from './fir-login';
import { useAuthState } from "react-firebase-hooks/auth";
import { LoadingPage } from './utils';

// Rather than using buttons to log in and sign up, use links to these pages and style them as buttons

function Logout() {
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (auth.currentUser) {
            logOut()
                .then(() => { setTimeout(() => {
                    navigate("/", { replace: true })
                }, 1000);}
                );
            } else {
                navigate('/', {replace: true});
            }
        }, [navigate]);
      
        return (<>  <LoadingPage />
                    <Card
                        bgcolor="primary"
                        txtcolor="white"
                        header="BadBank"
                        title="Thanks for using BadBank!"
                        text="A friendly bank with an excellent website, but poor services"
                        body={(<div><img src="./bank_logo.png" className="img-fluid" alt="Responsive Site"/></div>)}
                    />
                </>);
      };

export default Logout;