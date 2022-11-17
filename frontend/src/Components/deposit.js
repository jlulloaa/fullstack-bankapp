import React from 'react';
import { Navigate } from 'react-router-dom';
import { formatBalance, ToolTips } from './utils';
import Card from './card';
// import { useCtx } from './context';
import { auth } from './loginbankingapp';

function Deposit() {

    // const { user, setContext } = useCtx();
    const user = auth.currentUser; // useCtx();
    // The logic here is going to completely change, as we now have to connect to the backend...
    // const [balance, setBalance] = React.useState(user.at(-1).history.at(-1).balance);
    const [balance, setBalance] = React.useState(user.history.at(-1).balance);
    const [btndisabled, setBtnDisabled] = React.useState(true);
    const [depositValue, setDepositValue] = React.useState("");
    const [deposit, setDeposit] = React.useState(null);
    
    
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
        console.log(user);
        // The new functionality 'at(index)' allows to get the last element by setting index=-1 (ES2022):
        user.history.push({ 
            deposit: deposit,
            withdraw: '',
            balance : balance + deposit,
            date: now.toLocaleDateString('en-GB'),
            time: now.toTimeString()
        });
        // setContext(user);
        setBalance(user.history.at(-1).balance);
        setDeposit(null);
        setDepositValue("");
        setBtnDisabled(true);
    }

    return (<Card 
                bgcolor="primary"
                txtcolor="white"
                header="BadBank"
                title="DEPOSITS"
                text={<>Hello{(user.name === '') ? <>! </>: <>, {user.name}! </>}Here you can add funds to your account</>}
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
            />
    );
}

export default Deposit;