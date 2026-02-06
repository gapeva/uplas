// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Tailwind (if keeping) or basic reset
import './styles/variables.css'
import './styles/global.css'
// Note: You might need to import specific page CSS in those page components or make them global here.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
