import Card from './card';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router';
import { ToolTips, Header, Tagline} from './utils';
// import { useCtx } from './context';
// Rather than using buttons to log in and sign up, use links to these pages and style them as buttons
import { auth } from './fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LoadingPage } from './utils';
import { ButtonGroup } from 'react-bootstrap';

function Home() {

    const [user, loading] = useAuthState(auth);
    // const currUser = useCtx();
    // console.log(`Home Page: ${JSON.stringify(currUser.user)}`);
    // console.log(`Home Page: ${JSON.stringify(user)}`);
    
    return (
        <> 
        {user ? (
             <Navigate replace to='/accountsummary'/>
        ) : (<> { loading ? <LoadingPage /> : <></>}
            <Card 
                bgcolor="primary"
                txtcolor="white"
                header=<Header/>
                title="Welcome to BadBank"
                text=<Tagline/>
                body={(<div><img src="./bank_logo.png" className="img-fluid" alt="Responsive Site"/>
                <ButtonGroup className="sm">
                {/* <span > */}
                <Link data-tip data-for="noAccountTip" to="/login" className="btn btn-success" >Login</Link>
                {/* </span> */}
                <Link data-tip data-for="createAccTip" to="/createAccount" className="btn btn-success">Sign up</Link>
                </ButtonGroup>
                <ToolTips></ToolTips>
                </div>)}
            /></>
        )}
        </>
    );
}

export default Home;