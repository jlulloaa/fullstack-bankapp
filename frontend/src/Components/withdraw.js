import React from 'react';
import { formatBalance, ToolTips } from './utils';
import Card from './card';
import { Navigate } from 'react-router-dom';
// import { useCtx } from './context';
import { auth } from './loginbankingapp';

function Withdraw() {

    // const { user, setContext } = useCtx();
    const user = auth.currentUser; // useCtx();
    const [balance, setBalance] = React.useState(user.at(-1).history.at(-1).balance);
    const [btndisabled, setBtnDisabled] = React.useState(true);
    const [withdrawValue, setWithdrawValue] = React.useState("");
    const [withdrawal, setWithdrawal] = React.useState(null);
 
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
        //  replicate the last element to populate it with the new transaction:
        //  user.push({...user.at(-1)});
        let now = new Date();
        // This new functionality allows to get the last element (ES2022):
        user.at(-1).history.push({
            deposit: '',
            withdraw: withdrawal,
            balance: balance - withdrawal,
            date: now.toLocaleDateString('en-GB'),
            time: now.toTimeString()
        });
        // setContext(user);
        setBalance(user.at(-1).history.at(-1).balance);
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
            text={<>Hello{(user.at(-1).name === '') ? <>! </>: <>, {user.at(-1).name}! </>}Here you can withdraw funds from your account</>}
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
    );
}

export default Withdraw;