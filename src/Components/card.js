import React from 'react';

// Add card template component to use across the whole application:
function Card(props) {
    function classes(){
      const bg = props.bgcolor ? ' bg-' + props.bgcolor : ' ';
      const txt = props.txtcolor ? ' text-' + props.txtcolor : ' text-white';
      return 'card mx-auto mb-3 ' + bg + txt;
    }
  
    return (
      <div className={classes()} style={{maxWidth: "18rem"}}>
        <div className='card-header'> {props.header} </div>
        <div className='card-body border-primary'>
        {props.title && (<h5 className='card-title'> {props.title}</h5>)}
        {props.text && (<p className='card-text'> {props.text}</p>)}
        {props.body}
        {props.status && (<div id='createStatus'> {props.status}</div>)}
        </div>
      </div>
    )
  }

  export default Card;
  