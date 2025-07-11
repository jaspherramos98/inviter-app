// File: frontend/src/index.js
// Path: /inviter-app/frontend/src/index.js
// Description: React app entry point with CSS imports

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);