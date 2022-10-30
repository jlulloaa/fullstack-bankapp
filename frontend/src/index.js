import React from 'react';
import { createRoot } from 'react-dom/client';
// Add bootstrap theme Spacelab from bootswatch:
import "bootswatch/dist/spacelab/bootstrap.css";

// Put any other imports below so that CSS from your components takes precedence over default styles.
import './styles/index.css';

import App from './App';
// import reportWebVitals from './reportWebVitals';

// When using React ≥v6, BroswerRouter replaces React.StrictMode to make the router feature accessible from any part of the SPA
// See this thread for more details: https://www.freecodecamp.org/news/how-to-use-react-router-version-6/

const root = createRoot(document.getElementById('root'));
root.render(<App /> );
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
