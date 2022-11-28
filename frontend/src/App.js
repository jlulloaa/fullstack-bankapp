// How inefficient is to import React in any file that uses it? Would there be another way??
import React from 'react';
// Because I'm using them here, I have to import them from here, not in index.js
import {
  Routes,
  Route
} from 'react-router-dom';

import { HashRouter  as Router } from 'react-router-dom';
// In the class' video, they used HashRouter, but in this article, it is recommended to use BrowserRouter instead, and only if strictly necessary, use HashBrowser

import Home from './Components/home';
import Deposit from './Components/deposit';
import Transfer from './Components/transfer';
import Withdraw from './Components/withdraw';
import AllData from './Components/alldata';
import Login from './Components/login';
import Logout from './Components/logout';
import CreateAccount from './Components/createaccount';
import AccountSummary from './Components/accountsummary';
import About from './Components/about';
import Products from './Components/products';
import Reset from './Components/workinprogress';
import NavBar from './Components/navbar';
import Footer from './Components/footer';

import './styles/App.css';
import { Container } from 'react-bootstrap';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Components/fir-login';

import { useState, useEffect } from 'react';

// the syntax here is quite different to the one presented in the videos, most probably because they are outdated and were made before react-router-dom v6. See this thread https://stackoverflow.com/questions/69832748/error-error-a-route-is-only-ever-to-be-used-as-the-child-of-routes-element
// and this article: https://reactrouter.com/docs/en/v6/getting-started/concepts
function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth,(user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, [user]);


  // As learned from this blog (https://dmitripavlutin.com/react-context-and-usecontext/), all components that'll consume the context, have to be wrapped inside the Provider
  return (
    <Container className="App">
      <Router>
          <h1> 
            <img className="img-fluid float-left" src="./bank_logo.png"  width="8%" alt="Bank Logo Left"/>  
              <span> Welcome to BadBank</span>
            <img className="img-fluid float-right" src="./bank_logo.png" width="8%" alt="Bank Logo Right"/> 
          </h1>
        {/* Add the navigation bar */}
        <NavBar />
        {user ? <div style={{display: 'flex', justifyContent: 'right'}}>{(user.displayName)} ({(user.email)})</div> : <></>}
        <hr/>
          <Routes>
            <Route path="/" exact element={<Home/>} />
            <Route path="/createAccount" exact element={<CreateAccount/>} />
            <Route path="/login" exact element={<Login/>} />
            <Route path="/accountsummary" exact element={<AccountSummary/>} />
            <Route path="/deposit" exact element={<Deposit/>} />
            <Route path="/withdraw" exact element={<Withdraw/>} />
            <Route path="/transfer" exact element={<Transfer/>} />
            <Route path="/allData" exact element={<AllData/>} />
            <Route path="/logout" exact element= {<Logout/>} />
            <Route path="/about" exact element={<About/>} />
            <Route path="/products" exact element={<Products/>} />
            <Route path="/reset" exact element={<Reset/>} />
          </Routes>
        <Footer />
    </Router>
  </Container>
  );
}

// In order to clarify import/export default and non-defaults, see this thread:
// https://stackoverflow.com/questions/36795819/when-should-i-use-curly-braces-for-es6-import/36796281#36796281
export default App;
