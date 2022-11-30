import { useEffect} from 'react';
import Card from './card';
import { useNavigate } from 'react-router-dom';
import {auth, logOut } from '../utils/fir-login';
import { LoadingPage } from '../utils/tools';

// Rather than using buttons to log in and sign up, use links to these pages and style them as buttons
function Logout() {
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