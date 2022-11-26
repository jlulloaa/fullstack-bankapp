import Card from './card';
import { Link, Navigate } from 'react-router-dom';
import { ToolTips, Tagline } from './utils';

// import { useCtx } from './context';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logOut } from './fir-login';
import { ButtonGroup } from 'react-bootstrap';
import { LoadingPage, Header } from './utils';

// After successfully logged in, display basic information about the user.
// Once landing here, I have everything to connect to the backend, and I'm sure the user is successfully logged in

function AccountSummary() {
    // const currState = useCtx();
    
    // console.log(`Current user AUTH: ${JSON.stringify(auth.currentUser)}`);
    const [user,] = useAuthState(auth);
    const GreetingTxt = `Hello${user ? ', ' + user.displayName:' '}! \nWelcome to BadBank`;
    
    if (user) {
        console.log(user.getIdToken());
        
    }

    // const handleLogout = async () => {
    //     await logOut();
    // };
    
    // Send login details to mongodb via axios:
    
    
    return (
        <Card 
            bgcolor="primary"
            txtcolor="white"
            header=<Header/>
            title= { GreetingTxt }
            text=<Tagline/>
            body={ !user ? (
                <Navigate replace to="/login" ></Navigate>
            ) : (<>
                    <div>
                        <span>
                            <img src="./bank_logo.png" className="img-fluid" alt="Responsive Site"/>
                        </span>
                    </div>
                    <div>
                    {/* Arrange the buttons as a table to look tidier */}
                        <ButtonGroup vertical className="sm">
                            <Link data-tip data-for="depositClickTip" to="/deposit" className="btn btn-success" >
                                Deposit
                            </Link>
                            <Link data-tip data-for="withdrawClickTip" to="/withdraw" className="btn btn-success" >
                                Withdrawal
                            </Link>
                        </ButtonGroup>

                        <ButtonGroup vertical className="sm">
                            <Link data-tip data-for="transferClickTip" to="/transfer" className="btn btn-success" >
                                Transfer
                            </Link>
                            <Link data-tip data-for="allDataTip" to="/alldata" className="btn btn-success">
                                Statement
                            </Link>
                        </ButtonGroup>

                        <ButtonGroup vertical className="sm">
                        <Link data-tip data-for="allDataTip" to="/logout" className="btn btn-outline-success">
                                Logout
                            </Link>
                            {/* <button data-tip data-for="logoutTip" className="btn btn-outline-success" onClick={handleLogout}>Logout</button> */}
                        </ButtonGroup>
                        <ToolTips></ToolTips>
                    </div>
                </>
            )}
         />
    );
}

export default AccountSummary;
