import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import Home from './page/home/home.js';

//removed <React.StrictMode>
ReactDOM.render(
        <Home/>, 
    document.getElementById('root'));


