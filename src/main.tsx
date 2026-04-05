import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Reset existing Vite styles and use our custom globals
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
