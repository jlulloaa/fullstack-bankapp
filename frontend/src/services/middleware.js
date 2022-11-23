/** middleware.js
 * Set of functions to transfer data between the front and back end
 */
 import { logOut, removeUser } from '../Components/fir-login';

// Create another function to create the user in the backend, keep things separated
import axios from 'axios';

const urlAddUser = `${process.env.REACT_APP_API_URL}/create`;
const urlAddTransaction = `${process.env.REACT_APP_API_URL}/addtransaction`;
const urlReadAllData = `${process.env.REACT_APP_API_URL}/readall`;
const urlReadSingleData = `${process.env.REACT_APP_API_URL}/readone`;

  
const createToken = async (user) => {
    const token = user && (await user.getIdToken());
    const payloadHeader = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    };
    return payloadHeader;
  }

// Post New User data
const postNewUser = async (user) => {
    const payload = { 
        user: {
            name: user.name ? user.name : user.displayName,
            email: user.email,
            id: user._id
        }
    }
    try {
        console.log('Creating new user...');
        const res = await axios.post(urlAddUser, payload);
        console.log('User successfully created in the backend');
        return res.data;
    } catch(err) {
        console.error(`PostNewUser error: ${err}`);
        removeUser();
        logOut();
        alert(`Cannot create new User ${err}`);
        return null;
    }
  };


// Post a new transaction 
const postNewTransaction = async (userData) => {
    const header = await createToken(userData.user);
    const payload = {
        user: userData.user,
        transaction_type : userData.transact_type,
        transaction_amount: userData.transact_amount,
        updated_balance: userData.updated_balance,
        timestamp: userData.timestamp
    }
    try {
        console.log(`Adding new data to history transaction...`);
        const res = await axios.post(urlAddTransaction, payload, header);
        console.log(`Received something ${res.data}`)
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
            const res = await axios.get(urlReadAllData, {params: payload}, header);
            return res.data;
        } 
    catch (err) 
        {
            console.error(`GetAllBankingData error: ${err}`);
        }
  }

//   Get single data based on a specific parameter
const getBankingTransactions = async (user) => {
    const header = await createToken(user);
    const payload = {email: user.email};
    try
        {
            const history = await axios.get(urlReadSingleData, {params: payload}, header);
            const currBalance = history.data.balance;
            return currBalance;
        }
    catch (err)
        {
            console.error(`GetBankingTransactions error: ${err}`);
        }
};

export {postNewUser, createToken, getAllBankingData, getBankingTransactions, postNewTransaction}