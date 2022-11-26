import Card from './card';
import { Link, Navigate } from 'react-router-dom';
import { ToolTips, Tagline, Header } from './utils';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './fir-login';
import { ButtonGroup } from 'react-bootstrap';

// After successfully logged in, display basic information about the user.
// Once landing here, I have everything to connect to the backend, and I'm sure the user is successfully logged in

function AccountSummary() {
    const [user,] = useAuthState(auth);
    const GreetingTxt = `Hello${user ? ', ' + user.displayName:' '}! \nWelcome to BadBank`;
    
    if (user) {
        console.log(user.getIdToken());
        
    }    
    
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
                        <hr></hr>
                        <ButtonGroup vertical className="sm">
                        <Link data-tip data-for="allDataTip" to="/logout" className="btn btn-outline-success">
                                Logout
                        </Link>
                        </ButtonGroup>
                        <ToolTips></ToolTips>
                    </div>
                </>
            )}
         />
    );
}

export default AccountSummary;
