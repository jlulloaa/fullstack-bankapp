import React, {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { formatBalance, ToolTips } from './utils';
import Card from './card';
import { auth } from './fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';
import {getBankingTransactions, postNewTransaction, getBankingDetails} from '../services/middleware';
import { LoadingPage } from './utils';

function Withdraw() {

    const [user,] = useAuthState(auth);

    const [fetchingdata, setFetchingdata] = useState(false);
    const [balance, setBalance] = useState();
    const [accountNro, setAccountNro] = useState();
    const [btndisabled, setBtnDisabled] = useState(true);
    const [withdrawValue, setWithdrawValue] = useState("");
    const [withdrawal, setWithdrawal] = useState(null);
 
    useEffect(() => {
        const getBalance = async () => {
            setFetchingdata(true);
            const accNro = await getBankingDetails(user);
            setAccountNro(accNro);
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
        setWithdrawValue(e.target.value);
        if (parseInt(e.target.value) > 0) {
            // Is a valid numeric format, let see if the withdrawal can be covered with the balance:
            let rem = balance - parseInt(e.target.value);
            if (rem >= 0 ) {
                // Yes, there are enough funds to complete the operation
                setBtnDisabled(false);
                setWithdrawal(parseInt(e.target.value));    
            } else {
                // Not enough money to withdraw.
                alert('Not enough money to withdraw', null, 2);
                setBtnDisabled(true);
            }
        } else {
            setBtnDisabled(true);
        }
      }

    const onClickHandler = () => {
        let now = new Date();
        const new_transaction = { 
            user: user,
            transact_type: 'withdrawal',
            transact_amount: withdrawal,
            updated_balance: balance - withdrawal,
            timestamp: now,
        }
        postNewTransaction(new_transaction);
        setBalance(balance - withdrawal);

        setWithdrawal(null);
        setWithdrawValue("");
        setBtnDisabled(true);
    }

      return (
        <Card 
            bgcolor="primary"
            txtcolor="white"
            header="BadBank"
            title="WITHDRAWAL"
            text={<>Hello{user  ? <>, {user.displayName}! </> : <>! </>}Here you can withdraw funds from your account {accountNro}</>}
            body = {!user ? (
                    <Navigate replace to='/login'/>
                ) : (
                    <div> { fetchingdata ? <LoadingPage /> : <></>}
                    <label className="form-label mt-4">CURRENT BALANCE</label>
                    <div className="input-group mb-3" >
                        <span className="form-control badge bg-light" disabled>{formatBalance(balance)}</span>
                    </div>
                    <label className="form-label mt-4">WITHDRAW AMOUNT</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text">$</span>
                        <input data-tip data-for="withdrawAmountTip" type="number" className="form-control" id="withdrawField" aria-label="Amount (to the nearest dollar)" value={withdrawValue} onChange={onChangeHandler}/>
                        <span className="input-group-text">.00</span>
                        <button data-tip data-for="withdrawClickTip" type="button" className="btn btn-success" id="withdrawClick" disabled={btndisabled}
                        onClick={onClickHandler}>WITHDRAW</button>
                    </div>
                    <ToolTips></ToolTips>
                </div>
            )}
         />
    );
}

export default Withdraw;