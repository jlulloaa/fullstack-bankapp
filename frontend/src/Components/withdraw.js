import React, {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { formatBalance, ToolTips } from '../utils/tools';
import Card from './card';
import { auth } from '../utils/fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';
import {postNewTransaction, getBankingDetails} from '../utils/middleware';
import { LoadingPage, Header } from '../utils/tools';
import Swal from 'sweetalert2';

function Withdraw() {

    const [user,] = useAuthState(auth);

    const [fetchingdata, setFetchingdata] = useState(true);
    const [balance, setBalance] = useState();
    const [accountNro, setAccountNro] = useState();
    const [btndisabled, setBtnDisabled] = useState(true);
    const [withdrawValue, setWithdrawValue] = useState("");
    const [withdrawal, setWithdrawal] = useState(null);
 
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
                Swal.fire({
                    icon: 'error',
                    title: 'Operation not allowed',
                    text: 'Not enough money to withdraw!',
                    footer: 'Try with a different amount'
                  })
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
            account_nro: accountNro,
            transact_type: 'withdrawal',
            transact_amount: withdrawal,
            updated_balance: balance - withdrawal,
            timestamp: now,
        }
        const withdrawText = `You are going to take ${formatBalance(new_transaction.transact_amount)} from your account`;
        Swal.fire({
            title: 'Proceed?',
            text: `${withdrawText}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
                postNewTransaction(new_transaction);
                setBalance(balance - withdrawal);
                setWithdrawal(null);
                setWithdrawValue("");
                setBtnDisabled(true);
                Swal.fire(
                    'Done!',
                    `Your balance is now ${formatBalance(balance - withdrawal)}`,
                    'success'
                )
            }
        })
    }

      return(<> { fetchingdata ? <LoadingPage /> : <></>} 
                <Card 
                    bgcolor="primary"
                    txtcolor="white"
                    header=<Header/>
                    title="WITHDRAWAL"
                    text={<>Hello{user  ? <>, {user.displayName}! </> : <>! </>}<br/>Here you can withdraw funds from your account Nro: {accountNro}</>}
                    body = {!user ? (
                            <Navigate replace to='/login'/>
                            ) : (
                            <div>
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
            </>
    );
}

export default Withdraw;