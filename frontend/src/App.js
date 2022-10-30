// How inefficient is to import React in any file that uses it? Would there be another way??
import React from 'react';
// Because I'm using them here, I have to import them from here, not in index.js
import {
  Routes,
  Route
} from 'react-router-dom';

import { HashRouter  as Router } from 'react-router-dom';
// In the class' video, they used HashRouter, but in this article, it is recommended to use BrowserRouter instead, and only if strictly necessary, use HashBrowser

// Define context - As read in here: separate the UserContext in a different file, may provide more flexibility when adding a backend
// const UserContext = React.createContext(null);
import UserContext from './Components/context';

import Home from './Components/home';
import Deposit from './Components/deposit';
import Withdraw from './Components/withdraw';
import AllData from './Components/alldata';
import Login from './Components/login';
import CreateAccount from './Components/createaccount';
import About from './Components/about';
import Products from './Components/products';
import NavBar from './Components/navbar';
import Footer from './Components/footer';

// import { LanguageChange } from './Components/utils';

import './styles/App.css';
import { Container } from 'react-bootstrap';

// the syntax here is quite different to the one presented in the videos, most probably because they are outdated and were made before react-router-dom v6. See this thread https://stackoverflow.com/questions/69832748/error-error-a-route-is-only-ever-to-be-used-as-the-child-of-routes-element
// and this article: https://reactrouter.com/docs/en/v6/getting-started/concepts
function App() {

  // Initialises the context variables that will define the user details:
  const initUser = [{name: '', email: '', password: '', history: [{deposit: '', withdraw: '', balance:0}]}];

  return (
    <Container className="App">
      <Router>
          <h1> 
            <img className="img-fluid float-left" src="./bank_logo.png"  width="8%" alt="Bank Logo Left"/>  
              <span> Welcome to BadBank </span>
            <img className="img-fluid float-right" src="./bank_logo.png" width="8%" alt="Bank Logo Right"/> 
          </h1>
        {/* Add the navigation bar */}
        <NavBar />
        <hr/>
        {/* By using Provider, we are making the value available to all children and grandchildren */}
        {/* As learned from this blog (https://dmitripavlutin.com/react-context-and-usecontext/), all components that'll consume the context, have to be wrapped inside the Provider */}
        {/* TODO: value can be read from a json file, so later on would be better to create a function to specifically get them... */}
        <UserContext.Provider value = { initUser }>
          <Routes>
            <Route path="/" exact element={<Home/>} />
            <Route path="/createAccount" exact element={<CreateAccount/>} />
            <Route path="/login" exact element={<Login/>} />
            <Route path="/deposit" exact element={<Deposit/>} />
            <Route path="/withdraw" exact element={<Withdraw/>} />
            <Route path="/allData" exact element={<AllData/>} />
            <Route path="/about" exact element= {<About/>} />
            <Route path="/products" exact element={<Products/>} />
          </Routes>
        </UserContext.Provider>
        <Footer />
    </Router>
  </Container>
  );
}

// In order to clarify import/export default and non-defaults, see this thread:
// https://stackoverflow.com/questions/36795819/when-should-i-use-curly-braces-for-es6-import/36796281#36796281
export default App;
// export {UserContext, useContext};
