import Card from './card';
import { Link, Navigate } from 'react-router-dom';
import { ToolTips } from './utils';

// import { useCtx } from './context';
import { auth, logOut } from './loginbankingapp';

// After successfully logged in, display basic information about the user. Or just a welcome message?

function AccountSummary() {
    // const currState = useCtx();
    
    // console.log(`Current user AUTH: ${JSON.stringify(auth.currentUser)}`);

    const handleLogout = async () => {
        await logOut();
    };

    const GreetingTxt = `Hello${(auth.currentUser) ? ', ' + auth.currentUser.displayName:' '}!, welcome to BadBank`;
    
    return (
        <Card 
            bgcolor="primary"
            txtcolor="white"
            header="BadBank"
            title= { GreetingTxt }
            text="A friendly bank with an excellent website, but poor services"
            body={ !auth.currentUser ? (
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
