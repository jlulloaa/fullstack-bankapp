/** middleware.js
 * Set of functions to transfer data between the front and back end
 */
 import { logOut, removeUser } from './fir-login';

// Create another function to create the user in the backend, keep things separated
import axios from 'axios';

const urlAddUser = `${process.env.REACT_APP_API_URL}/create`;
const urlAddTransaction = `${process.env.REACT_APP_API_URL}/addtransaction`;
const urlReadAllData = `${process.env.REACT_APP_API_URL}/readall`;
const urlGetAllEmail = `${process.env.REACT_APP_API_URL}/getallemail`;
const urlReadSingleData = `${process.env.REACT_APP_API_URL}/readone`;
const urlCheckUserExists = `${process.env.REACT_APP_API_URL}/isuser`;
const urlReadBankData = `${process.env.REACT_APP_API_URL}/readbankdetails`;

const createToken = async (user) => {
    const token = user && (await user.getIdToken());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
    };
    return headers;
  }

// Post New User data
const postUser = async (user) => {
    const payload = { 
        user: {
            name: user.name ? user.name : user.displayName,
            email: user.email,
            id: user._id
        }
    }
    // Check the email is not in use in the dB:
    const header = await createToken(user);   
    const inUse = await axios.get(urlCheckUserExists, {params: {email: user.email}, headers: header});
    if (!inUse.data) {
        console.log('Creating new user...');
        axios.post(urlAddUser, payload, {headers:header})
            .then((res) => {
                console.log('User successfully created in the backend');
                return res.data;
            })
            .catch((err) => {
                removeUser();
                logOut();
                alert(`Cannot create new User ${err}`);
                return null;
            })
    }
};

// Post a new transaction 
const postNewTransaction = async (userData) => {
    const header = await createToken(userData.user);
     const payload = {
        user: userData.user,
        account_nro: userData.account_nro,
        transaction_type : userData.transact_type,
        transaction_amount: userData.transact_amount,
        updated_balance: userData.updated_balance,
        timestamp: userData.timestamp,
        receipt_email: userData.receipt_email
    }
    try {
        console.log(`Adding new data to history transaction...`);
        const res = await axios.post(urlAddTransaction, payload, {headers:header}); //{data: payload, headers: header});
        return res.data;
    } catch (err) {
        console.error(`postNewTransaction error: ${err}`);
    }
};

//   Get all data
const getAllBankingData = async (user) => {
    const header = await createToken(user);
    const payload = {email: user.email}
    try 
        {
            const res = await axios.get(urlReadAllData, {params: payload, headers: header});
            return res.data;
        } 
    catch (err) 
        {
            console.error(`GetAllBankingData error: ${err}`);
        }
  }

//   Get history transactions, based on the email (is unique for the dB users)
const getBankingTransactions = async (user) => {
    const header = await createToken(user);
    const payload = {email: user.email};
    try
        {
            const history = await axios.get(urlReadSingleData, {params: payload, headers: header});
            const currBalance = history.data.balance;
            return currBalance;
        }
    catch (err)
        {
            console.error(`GetBankingTransactions error: ${err}`);
        }
};

//   Get Account Nro, based the email (is unique for the dB users)
const getBankingDetails = async (user) => {
    const header = await createToken(user);
    const payload = {email: user.email};
    try
        {
            const bankDetails = await axios.get(urlReadBankData, {params: payload, headers: header});
            const accountDetails = {accountNro: bankDetails.data.account[0].account_nro, 
                                    currBalance: bankDetails.data.history.at(-1).balance};
            return accountDetails;
        }
    catch (err)
        {
            console.error(`GetBankingTransactions error: ${err}`);
        }
};

// Get all email to display in a list:
const getAllEmail = async (user) => {
    const header = await createToken(user);
    const payload = {email: user.email};
    try {
        const res = await axios.get(urlGetAllEmail, {params: payload, headers: header});
        return res.data;
    }
    catch (err) {
        console.log(`getAllEmail error (${err})`);
    }
}

export {postUser, createToken, getAllBankingData, getAllEmail, getBankingTransactions, postNewTransaction, getBankingDetails} //, postNewTransfer}