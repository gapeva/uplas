// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// IMPORT LEGACY CSS FILES HERE TO MAINTAIN VISUAL PARITY
import './styles/variables.css'; 
import './styles/global.css'; 
import './index.css'; // Tailwind base

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
