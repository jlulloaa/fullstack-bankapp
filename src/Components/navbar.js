// How about using react-bootstrap??
import {Container, Nav, Navbar} from 'react-bootstrap';
// In order to style the navigation bar, is better to use NavLink instead of Link (see https://v5.reactrouter.com/web/api/NavLink). But, in order to make the navbar truly collapsable, had to stick with Link (see last comment below)
import { Link } from 'react-router-dom';

import { LanguageChange } from './utils';

// The 'exact' keyword in the Link to Home ensures that only returns the route if the path is an exact match to the current URL. This is particularly important in the Home path because is only defined by "/", which is also present in all the other paths. See https://staceycarrillo.medium.com/highlight-the-active-navigation-bar-link-using-navlink-in-react-d44f5d8bf997 for details 

// To highlight the active path use NavLink instead of Link as indicated in https://v5.reactrouter.com/web/api/NavLink

// After many attemps, finally learned how to collapse the navbar after clicking in an element (apparently, in the newest versions of react/react-router, there is a bug that causes the flag collapseOnSelect not to work as it should be). For the solution, see here: https://codesandbox.io/s/collapse-bootstrap-nav-with-bootstrap-js-cdz8gi?file=/src/Nav.js:104-318 and the thread associated: https://forum.freecodecamp.org/t/closing-bootstrap-navbar-on-click-of-link/499339 Also added a brief pause to make it more UI friendly :) 

// Last update (20/08/2022): Finally managed to make it (really) work the collapsable navbar without breaking anything else. The answer was found on this thread: https://stackoverflow.com/questions/56464444/collapseonselect-in-react-bootstrap-navbars-with-react-router-dom-navlinks, using Link from react-router-dom and adding HREF (this last thing was what made the collapsable function to work)

function NavBar() {

    return (
        <Navbar collapseOnSelect bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand data-tip data-for="homeTip" href="/"> 
                    <img src="./bank_logo.png" height="32px" alt="Bank Logo"/>
                </Navbar.Brand>
                <LanguageChange></LanguageChange>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" className="ms-auto" defaultActiveKey="/" >
                        <Nav.Link data-tip data-for="createAccTip" className="nav-link" to="/createAccount" as={Link} href="/createAccount" > Create Account</Nav.Link>
                        <Nav.Link data-tip data-for="existAccTip"  className="nav-link" to="/login" as={Link} href="/login" > Login</Nav.Link>
                        <Nav.Link data-tip data-for="depositTip" className="nav-link" to="/deposit" as={Link} href="/deposit"> Deposit</Nav.Link>
                        <Nav.Link data-tip data-for="withdrawTip" className="nav-link" to="/withdraw" as={Link} href="/withdraw" > Withdrawal</Nav.Link>
                        <Nav.Link data-tip data-for="allDataTip" className="nav-link" to="/allData" as={Link} href="/allData" > All data</Nav.Link>
                        <Nav.Link data-tip data-for="aboutTip" className="nav-link" to="/about" as={Link} href="/about" > About Us</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
