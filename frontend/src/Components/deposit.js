import React, {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { formatBalance, ToolTips } from './utils';
import Card from './card';
// import { useCtx } from './context';
import { auth } from './fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';
import {getBankingTransactions, postNewTransaction} from '../services/middleware';
import { LoadingPage } from './utils';

function Deposit() {

    // const { user, setContext } = useCtx();
    // const user = auth.currentUser; // useCtx();

    const [user,] = useAuthState(auth);
    // Get user latest balance (main assumption is the latest transaction has the most up to date balance)
    const [fetchingdata, setFetchingdata] = useState(false);

     

    // The logic here is going to completely change, as we now have to connect to the backend...
    // const [balance, setBalance] = React.useState(user.at(-1).history.at(-1).balance);
    const [balance, setBalance] = useState(); //user.history.at(-1).balance);
    const [btndisabled, setBtnDisabled] = useState(true);
    const [depositValue, setDepositValue] = useState("");
    const [deposit, setDeposit] = useState(null);
    
    useEffect(() => {
        const getBalance = async () => {
            setFetchingdata(true);
            const currBalance = await getBankingTransactions(user);
            setBalance(currBalance);
        }
        getBalance();
        setFetchingdata(false);
    }, [user]);

    if (balance === undefined) {
        setBalance(null);
    }

    const onChangeHandler = (e)=>{
        e.preventDefault();
        setDepositValue(e.target.value);
        if (parseInt(e.target.value) > 0) {
            setBtnDisabled(false);
            setDeposit(parseInt(e.target.value));
        } else {
            setBtnDisabled(true);
        }
      }
    
    const onClickHandler = () => {
        // replicate the last element to populate it with the new transaction:
        // user.push({...user.at(-1)});
        let now = new Date(); // Timestamp defined here
        // The new functionality 'at(index)' allows to get the last element by setting index=-1 (ES2022):
        const new_transaction = { 
            user: user,
            transact_type: 'deposit',
            transact_amount: deposit,
            updated_balance: balance + deposit,
            timestamp: now,
        }
        postNewTransaction(new_transaction);
        setBalance(balance + deposit);

        // email: userData.user.email,
        // transaction_type : userData.transact_type,
        // transaction_amount: userData.transact_amount,
        // updated_balance: userData.updated_balance,
        // timestamp: userData.timestamp

        // user.history.push({ 
        //     deposit: deposit,
        //     withdraw: '',
        //     balance : balance + deposit,
        //     date: now.toLocaleDateString('en-GB'),
        //     time: now.toTimeString()
        // });
        // setContext(user);
        // setBalance(user.history.at(-1).balance);
        setDeposit(null);
        setDepositValue("");
        setBtnDisabled(true);
    }

    return (<Card 
                bgcolor="primary"
                txtcolor="white"
                header="BadBank"
                title="DEPOSITS"
                text={<>Hello{user ? <>, {user.displayName}! </> : <>! </>}Here you can add funds to your account</>}
                body = { !user ? (
                    <Navigate replace to='/login'/>
                ) : (
                    <div> { fetchingdata ? <LoadingPage /> : <></>}
                        <label className="form-label mt-4">CURRENT BALANCE</label>
                        <div className="input-group mb-3" >
                            <span className="form-control badge bg-light" disabled>{formatBalance(balance)}</span>
                        </div>
                        <label className="form-label mt-4">DEPOSIT AMOUNT</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text">$</span>
                            <input data-tip data-for="depositAmountTip" className="form-control" type="number" id="depositField" aria-label="Amount (to the nearest dollar)" value={depositValue} onChange={onChangeHandler}/>
                            <span className="input-group-text">.00</span>
                            <button data-tip data-for="depositClickTip" className="btn btn-success" type="button" id="depositClick" disabled={btndisabled} onClick={onClickHandler}>DEPOSIT</button>
                        </div>
                        <ToolTips></ToolTips>
                    </div>
                )}
            />
    );
}

export default Deposit;