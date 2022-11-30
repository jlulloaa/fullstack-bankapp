import Card from './card';
import { ToolTips } from '../utils/tools';
const thisYear = new Date().getFullYear();

const title = <a href="https://github.com/jlulloaa/fullstack-bankapp" target="_blank" rel="noreferrer">
    <button className="btn btn-warning">
    BadBank on GitHub
    </button>
    </a>;

const MERN = () => {
    return (
        <table><tr>
        <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer" >
            <span className="badge bg-primary" data-bs-toggle="tooltip" data-bs-placement="left" title="https://www.mongodb.com/"><img src="mongodb.png" alt='MongoDB Icon' height="24"></img> MongoDB
            </span>
        </a>
         <a href="https://expressjs.com/" target="_blank" rel="noreferrer" >
            <span className="badge bg-primary" data-bs-toggle="tooltip" data-bs-placement="left" title="https://expressjs.com/"><img src="express.png" alt='Express Icon' height="16"></img> Express
            </span> 
        </a> 
         <a href="https://reactjs.org" target="_blank" rel="noreferrer" >
            <span className="badge bg-primary" data-bs-toggle="tooltip" data-bs-placement="left" title="https://reactjs.org"><img src="react.png" alt='React Icon' height="16"></img> React
            </span> 
        </a> 
         <a href="https://nodejs.org/" target="_blank" rel="noreferrer" >
            <span className="badge bg-primary" data-bs-toggle="tooltip" data-bs-placement="left" title="https://nodejs.org/"><img src="nodejs.png" alt='NodeJS Icon' height="16"></img> Node.js
            </span> 
        </a> 
        </tr>
        </table>           
    )
}
const about = <> 
    BadBank is a fullstack single-page web application (SPA) where a validated user can deposit, withdraw and transfer funds from the account, keeping track of the remaining balance and can even download a history of transactions<hr/>
    
    BadBank has been developed with the MERN stack
    <MERN/>

    <hr/>
    The frontend has been styled with 
    <a href="https://getbootstrap.com/" target="_blank" rel="noreferrer">
    <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/bootstrap-5-logo-icon.png" alt='Bootstrap Icon' height="16"></img>
    </a>
    Bootstrap, using 
    <a href="https://bootswatch.com" target="_blank" rel="noreferrer">
    <img src="https://camo.githubusercontent.com/51da0973891f15de1404fe9e17951136a420dafec4f9bbfa883e6283623c9317/68747470733a2f2f626f6f747377617463682e636f6d2f5f6173736574732f696d672f6c6f676f2d6461726b2e737667" alt='Bootswatch Icon' height="16"></img>
    </a>
    Bootswatch theme's <a href="https://bootswatch.com/spacelab" target="_blank" rel="noreferrer" className="btn btn-primary" alt='SpaceLab Icon'>Spacelab</a>
    <hr/>

    The backend has been developed in <a href="https://nodejs.org/" target="_blank" rel="noreferrer" ><img src="nodejs.png" alt='NodeJS Icon' height="16"/></a> Node.js runtime environment, using <a href="https://expressjs.com/" target="_blank" rel="noreferrer" ><img src="express.png" alt='Express Icon' height="16"/></a> Express framework<hr/>
    
    Data is managed in a cloud-based <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer" ><img src="mongodb.png" alt='MongoDB Icon' height="16"/></a> MongoDB Atlas database, and the Schemas developed with <a href="https://mongoosejs.com/" target="_blank" rel="noreferrer" ><img src="mongoose.png" alt='Mongoose Icon' height="16"/></a> <span data-tip data-for="ODMtooltip"> ODM Mongoose </span><hr/>
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

