import Card from './card';
const thisYear = new Date().getFullYear();

const title = <a href="https://github.com/jlulloaa/fullstack-bankapp" target="_blank" rel="noreferrer">
    <button className="btn btn-warning">
    BadBank on GitHub
    </button>
    </a>;

const about = <> 
    Bad Bank is single-page web application (SPA) developed with <a href="https://reactjs.org" target="_blank" rel="noreferrer" >
        <span className="badge bg-primary" data-bs-toggle="tooltip" data-bs-placement="left" title="https://reactjs.org"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/270px-React-icon.svg.png" alt='React Icon' height="16"></img> React
        </span> 
    </a> and styled with <a href="https://getbootstrap.com/" target="_blank" rel="noreferrer">
        <span className="badge bg-primary" data-bs-toggle="tooltip" data-bs-placement="left" title="https://getbootstrap.com/"><img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/bootstrap-5-logo-icon.png" alt='Bootstrap Icon' height="16"></img> Bootstrap
        </span>
    </a>, through <a href="https://bootswatch.com" target="_blank" rel="noreferrer">
        <span className="badge bg-primary" data-bs-toggle="tooltip" data-bs-placement="left" title="hhttps://bootswatch.com"><img src="https://camo.githubusercontent.com/51da0973891f15de1404fe9e17951136a420dafec4f9bbfa883e6283623c9317/68747470733a2f2f626f6f747377617463682e636f6d2f5f6173736574732f696d672f6c6f676f2d6461726b2e737667" alt='Bootswatch Icon' height="16"></img>  Bootswatch
        </span>
    </a> theme's <a href="https://bootswatch.com/spacelab" target="_blank" rel="noreferrer" alt='SpaceLab Icon'>
        <span className="badge rounded-pill bg-light" data-bs-toggle="tooltip" data-bs-placement="left" title="https://bootswatch.com/spacelab">
        Spacelab
        </span>
    </a>. BadBank emulates a banking application where a validated user can deposit and withdraw funds from the account, keeping track of the remaining balance and history of transactions.
    </>;

const body = <>
    <a href="https://jlulloaa.github.io" target="_blank" rel="noreferrer" alt='GitHub Icon'><button className="btn btn-outline-success" data-bs-toggle="tooltip" data-bs-placement="left" title="Click to see my other projects" > &copy; {thisYear} Jose L. Ulloa <img src="./logo192.png" height="16" alt='iSANDEx Logo'></img></button></a>
    </>

function About() {
    return (
        <Card 
            bgcolor="primary"
            txtcolor="white"
            header="ABOUT US"
            title={title}
            text={about}
            body = {body}
         />
    );
}

export default About;

