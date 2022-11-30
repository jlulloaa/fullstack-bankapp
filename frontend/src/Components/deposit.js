import React, {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { formatBalance, ToolTips } from '../utils/tools';
import Card from './card';
import { auth } from '../utils/fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';
import {postNewTransaction, getBankingDetails} from '../utils/middleware';
import { LoadingPage, Header } from '../utils/tools';
import Swal from 'sweetalert2';

function Deposit() {

    const [user,] = useAuthState(auth);
    // Get user latest balance (main assumption is the latest transaction has the most up to date balance)
    const [fetchingdata, setFetchingdata] = useState(true);

    // The logic here is going to completely change, as we now have to connect to the backend...
    const [balance, setBalance] = useState();
    const [accountNro, setAccountNro] = useState();
    const [btndisabled, setBtnDisabled] = useState(true);
    const [depositValue, setDepositValue] = useState("");
    const [deposit, setDeposit] = useState(null);

    useEffect(() => {
        const getBalance = async () => {
            const accountDetails  = await getBankingDetails(user);
            setAccountNro(accountDetails.accountNro);
            setBalance(accountDetails.currBalance);
            setFetchingdata(false);
        }
        getBalance();
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
        let now = new Date(); // Timestamp defined here
        // The new functionality 'at(index)' allows to get the last element by setting index=-1 (ES2022):
        const new_transaction = { 
            user: user,
            account_nro: accountNro,
            transact_type: 'deposit',
            transact_amount: deposit,
            updated_balance: balance + deposit,
            timestamp: now,
        }
        const depositText = `You are going to enter ${formatBalance(new_transaction.transact_amount)} into your account`;
        Swal.fire({
            title: 'Proceed?',
            text: `${depositText}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
          }).then((result) => {
            if (result.isConfirmed) {
                postNewTransaction(new_transaction)
                setBalance(balance + deposit)
                setDeposit(null);
                setDepositValue("");
                setBtnDisabled(true);
                Swal.fire(
                    'Done!',
                    `Your balance is now ${formatBalance(balance+deposit)}`,
                    'success'
                )
            }
          })
    }

    return (<> { fetchingdata ? <LoadingPage /> : <></>}   
            <Card 
                bgcolor="primary"
                txtcolor="white"
                header= <Header/>
                title="DEPOSITS"
                text={<>Hello{user ? <>, {user.displayName}! </> : <>! </>}<br/>Here you can add funds to your account Nro: {accountNro}</>}
                body = { !user ? (
                    <Navigate replace to='/login'/>
                ) : (
                    <div> 
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
            /></>
    );
}

export default Deposit;