import Card from './card';
import { Link, Navigate } from 'react-router-dom';
import { ToolTips } from './utils';

// import { useCtx } from './context';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logOut } from './fir-login';

// After successfully logged in, display basic information about the user.
// Once landing here, I have everything to connect to the backend, and I'm sure the user is successfully logged in

function AccountSummary() {
    // const currState = useCtx();
    
    // console.log(`Current user AUTH: ${JSON.stringify(auth.currentUser)}`);
    const [user,] = useAuthState(auth);
    const GreetingTxt = `Hello${ user ? ', ' + user.displayName:' '}!, welcome to BadBank`;
    
    if (user) {
        console.log(user.getIdToken());
        
    }

    const handleLogout = async () => {
        await logOut();
    };
    
    // Send login details to mongodb via axios:
    
    
    return (
        <Card 
            bgcolor="primary"
            txtcolor="white"
            header="BadBank"
            title= { GreetingTxt }
            text="A friendly bank with an excellent website, but poor services"
            body={ !user ? (
                <Navigate replace to="/login" ></Navigate>
            ) : (
                <div><img src="./bank_logo.png" className="img-fluid" alt="Responsive Site"/>
                <span data-tip data-for="depositTip">
                <Link to="/deposit" className="btn btn-success" >Deposit</Link>
                </span>
                <span data-tip data-for="withdrawTip">
                <Link to="/withdraw" className="btn btn-success" >Withdrawal</Link>
                </span>
                <Link data-tip data-for="allDataTip" to="/alldata" className="btn btn-success">Summary data</Link>
                <button className="btn btn-success" onClick={handleLogout}>
                            Logout
                        </button>
                <ToolTips></ToolTips>
                </div>
            )}
         />
    );
}

export default AccountSummary;
