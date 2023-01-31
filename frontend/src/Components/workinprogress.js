import Card from './card';
import { Link } from 'react-router-dom';

const title = <img src="./404.png" height="200" alt='iSANDEx Logo'></img>


const body = <>
    <Link replace to="/" className="btn btn-success" >Click to go back</Link>
    </>

function WIP() {
    return (
        <Card 
            bgcolor="primary"
            txtcolor="white"
            header="Ops!! PAGE NOT FOUND"
            title={title}
            text="Function requested has not been implemented yet"
            body = {body}
         />
    );
}

export default WIP;

