import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import { Navigate } from 'react-router-dom';
import { formatBalance, ToolTips } from './utils';
import Card from './card';
import { auth } from './fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';
import {getBankingTransactions, getAllEmail, postNewTransaction, getBankingDetails} from '../services/middleware';
import { LoadingPage, Header } from './utils';
import Swal from 'sweetalert2';

function Transfer() {

    const [user,] = useAuthState(auth);

    const [fetchingdata, setFetchingdata] = useState(false);
    const [balance, setBalance] = useState(); 
    const [accountNro, setAccountNro] = useState();
    const [btndisabled, setBtnDisabled] = useState(true);
    const [transferValue, setTransferValue] = useState("");
    const [transfer, setTransfer] = useState(null);
    const [recipientList, setRecipientList] = useState(null);
    const [receiptEmail, setReceiptEmail] = useState(null);


   useEffect(() => {
        const getBalance = async () => {
            setFetchingdata(true);
            getBankingDetails(user)
                .then((res) => setAccountNro(res))
            getAllEmail(user)
                .then((res) => setRecipientList(res))
            const currBalance = await getBankingTransactions(user);
            setBalance(currBalance);
            setFetchingdata(false);
        }
        getBalance();
    }, [user]);

    if (balance === undefined) {
        setBalance(null);
    }

    const onChangeHandler = (e)=>{
        e.preventDefault();
        setTransferValue(e.target.value);
        if (parseInt(e.target.value) > 0) {
            // Is a valid numeric format, let see if the transfer can be covered with the balance:
            let rem = balance - parseInt(e.target.value);
            if (rem >= 0 ) {
                // Yes, there are enough funds to complete the operation
                setBtnDisabled(false);
                setTransfer(parseInt(e.target.value));    
            } else {
                // Not enough money to transfer.
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
        console.log(receiptEmail);
        const new_transaction = { 
            user: user,
            transact_type: 'transferout',
            transact_amount: transfer,
            updated_balance: balance - transfer,
            timestamp: now,
            receipt_email: receiptEmail
        }
        const transferText = `We are going to transfer ${formatBalance(new_transaction.transact_amount)} to ${new_transaction.receipt_email}. \nAfter this, your balance will be ${formatBalance(new_transaction.updated_balance)}`;
        Swal.fire({
            title: 'Please check and click TRANSFER to proceed',
            text: `${transferText}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'TRANSFER'
          }).then((result) => {
            if (result.isConfirmed) {
                postNewTransaction(new_transaction);
                setBalance(balance - transfer);
                setTransfer(null);
                setTransferValue("");
                setBtnDisabled(true);
                Swal.fire(
                'Congratulations!',
                'Transfer has been done successfully.',
                'success'
              )
            }
          })
    }
    
    const selectEmail = (selectedOption) => {
        setReceiptEmail(selectedOption.label);
    }

      return (<> { fetchingdata ? <LoadingPage /> : <></>}
                <Card 
                    bgcolor="primary"
                    txtcolor="white"
                    header=<Header/>
                    title="TRANSFER"
                    text={<>Hello{user  ? <>, {user.displayName}! </> : <>! </>}<br/>Here you can transfer money from your account Nro: {accountNro} <br/>to other people within BadBank</>}
                    body = {!user ? (
                            <Navigate replace to='/login'/>
                            ) : (
                            <div>
                                <label className="form-label mt-4">CURRENT BALANCE:</label>
                                <div className="input-group mb-3" >
                                    <span className="form-control badge bg-light" disabled>{formatBalance(balance)}</span>
                                </div>
                                <div>
                                <label className="form-label"> RECIPIENT:</label><br/>
                                <Select className="form-control badge bg-light" options={ recipientList } isSearchable={true} onChange={selectEmail} menuPlacement="top" placeholder="Click to select a recipient" autoFocus={false}></Select>
                                {/* <button className="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Click to select a recipient </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <option className="dropdown-item" >Action</option>
                                    <option className="dropdown-item" >Another action</option>
                                    <option className="dropdown-item" >Something else here</option>
                                </div> */}
                                </div>
                                <label className="form-label mt-4">AMOUNT TO TRANSFER</label>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">$</span>
                                    <input data-tip data-for="transferAmountTip" type="number" className="form-control" id="transferField" aria-label="Amount (to the nearest dollar)" value={transferValue} onChange={onChangeHandler}/>
                                    <span className="input-group-text">.00</span>
                                    <button data-tip data-for="transferClickTip" type="button" className="btn btn-success" id="transferClick" disabled={btndisabled}
                                    onClick={onClickHandler}>TRANSFER</button>
                                </div>
                                <ToolTips></ToolTips>
                            </div>
                        )}
                />
            </>
    );
}

export default Transfer;