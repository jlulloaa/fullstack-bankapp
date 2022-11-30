import Card from './card';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router';
import { ToolTips, Header, Tagline} from '../utils/tools';
import { auth } from '../utils/fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LoadingPage } from '../utils/tools';
import { ButtonGroup } from 'react-bootstrap';

// Rather than using buttons to log in and sign up, use links to these pages and style them as buttons
function Home() {

    const [user, loading] = useAuthState(auth);
    
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
                <Link data-tip data-for="noAccountTip" to="/login" className="btn btn-success" >Login</Link>
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